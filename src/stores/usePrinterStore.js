import { defineStore } from 'pinia'
import { useWebsocketStore } from './useWebsocketStore'
import { useModalStore } from './useModalStore'
import { useGeneralVariablesStore } from './useGeneralVariablesStore'

export const usePrinterStore = defineStore('printer', () => {
  // Imported Variables
  const websocketStore = useWebsocketStore()
  const ModalStore = useModalStore()
  const GeneralVariablesStore = useGeneralVariablesStore()

  // Initialize
  function initPrinterLoad() {
    const waitForConnection = new Promise((resolve) => {
      const checkConnection = setInterval(() => {
        if (GeneralVariablesStore.isDatabaseLoaded && GeneralVariablesStore.isWebsocketConnected) {
          clearInterval(checkConnection)
          resolve()
        }
      }, 100)
    })

    waitForConnection
      .then(() => {
        subscribeToPrinterInfo()
        getHistoryTemperatures()
        getPrinterObjects()
        setLED()
        console.log('Printer Subscribed')
      })
      .catch((error) => {
        ModalStore.showErrorModal('Database is not loading: ' + error.message)
      })
  }

  // Helpers
  function handlePrinterData(data) {
    const { print_stats, gcode_move, heater_bed, extruder, toolhead, motion_report } = data
    const hotendFan = data['heater_fan hotend_fan']
    const layerBlower = data['fan_generic layer_blower']
    const auxBlower = data['fan_generic aux_blower_1']
    const led = data['fan_generic my_led']
    const endStop_standard_config = data['filament_switch_sensor mode_standard']
    const endStop_45_degrees_config = data['filament_switch_sensor mode_45_degrees']
    const endStop_filament_cut = data['filament_switch_sensor cutting_sensor']
    const endStop_filament = data['filament_switch_sensor filament']

    //End stops
    if (endStop_standard_config) {
      GeneralVariablesStore.printerConfig.position_standard =
        endStop_standard_config.filament_detected
      GeneralVariablesStore.checkPrinterConfig()
    }

    if (endStop_45_degrees_config) {
      GeneralVariablesStore.printerConfig.position_45 = endStop_45_degrees_config.filament_detected
      GeneralVariablesStore.checkPrinterConfig()
    }

    if (endStop_filament) {
      GeneralVariablesStore.controlStatus.filament_sensor = endStop_filament.filament_detected
    }

    if (endStop_filament_cut) {
      GeneralVariablesStore.controlStatus.filament_cut = endStop_filament_cut.filament_detected
    }

    // Update print_stats
    if (print_stats) {
      GeneralVariablesStore.printJobStatus.filename =
        print_stats.filename || GeneralVariablesStore.printJobStatus.filename
      GeneralVariablesStore.printJobStatus.state =
        print_stats.state || GeneralVariablesStore.printJobStatus.state
      GeneralVariablesStore.printJobStatus.progress =
        print_stats.progress || GeneralVariablesStore.printJobStatus.progress
      GeneralVariablesStore.printJobStatus.total_duration =
        print_stats.total_duration || GeneralVariablesStore.printJobStatus.total_duration
      GeneralVariablesStore.printJobStatus.print_duration =
        print_stats.print_duration || GeneralVariablesStore.printJobStatus.print_duration
      GeneralVariablesStore.printJobStatus.filament_used_mm =
        print_stats.filament_used || GeneralVariablesStore.printJobStatus.filament_used_mm
      GeneralVariablesStore.printJobStatus.total_layer =
        print_stats.total_layer || GeneralVariablesStore.printJobStatus.total_layer
      GeneralVariablesStore.printJobStatus.current_layer =
        print_stats.current_layer || GeneralVariablesStore.printJobStatus.current_layer

      // Calculate time_left
      if (
        GeneralVariablesStore.printJobStatus.progress > 0 &&
        GeneralVariablesStore.printJobStatus.print_duration > 0
      ) {
        GeneralVariablesStore.printJobStatus.time_left =
          GeneralVariablesStore.printJobStatus.print_duration *
          (1 / GeneralVariablesStore.printJobStatus.progress - 1)
      } else {
        GeneralVariablesStore.printJobStatus.time_left = 0
      }

      // Calculate grams used
      if (GeneralVariablesStore.printJobStatus.filament_used_mm > 0) {
        GeneralVariablesStore.printJobStatus.filament_used_g =
          (GeneralVariablesStore.printJobStatus.filament_used_mm *
            Math.PI *
            Math.pow(GeneralVariablesStore.filamentDiameter.value / 2, 2) *
            GeneralVariablesStore.filamentDensity.value) /
          1000
      }
    }

    // Update gcode_move
    if (gcode_move) {
      GeneralVariablesStore.printJobStatus.speed_factor =
        gcode_move.speed_factor || GeneralVariablesStore.printJobStatus.speed_factor
      GeneralVariablesStore.printJobStatus.extruder_factor =
        gcode_move.extrude_factor || GeneralVariablesStore.printJobStatus.extruder_factor
    }

    // Update heater_bed
    if (heater_bed) {
      GeneralVariablesStore.temperatureStatus.bed_current_temp =
        heater_bed.temperature || GeneralVariablesStore.temperatureStatus.bed_current_temp
      GeneralVariablesStore.temperatureStatus.bed_target_temp =
        heater_bed.target || GeneralVariablesStore.temperatureStatus.bed_target_temp
      GeneralVariablesStore.temperatureStatus.bed_status_temp =
        heater_bed.status || GeneralVariablesStore.temperatureStatus.bed_status_temp
      if (heater_bed.temperatures) {
        GeneralVariablesStore.temperatureStatus.bed_historic_temp = heater_bed.temperatures.slice(
          -GeneralVariablesStore.temperatureStatus.maximum_history_values,
        )
      }
      if (heater_bed.target) {
        GeneralVariablesStore.isBedTarget = true
      }
    }

    // Update extruder
    if (extruder) {
      GeneralVariablesStore.temperatureStatus.hotend_current_temp =
        extruder.temperature || GeneralVariablesStore.temperatureStatus.hotend_current_temp
      GeneralVariablesStore.temperatureStatus.hotend_target_temp =
        extruder.target || GeneralVariablesStore.temperatureStatus.hotend_target_temp
      GeneralVariablesStore.temperatureStatus.hotend_status_temp =
        extruder.status || GeneralVariablesStore.temperatureStatus.hotend_status_temp
      if (extruder.temperatures) {
        GeneralVariablesStore.temperatureStatus.hotend_historic_temp = extruder.temperatures.slice(
          -GeneralVariablesStore.temperatureStatus.maximum_history_values,
        )
      }
      if (extruder.target) {
        GeneralVariablesStore.isHotendTarget = true
      }
    }

    // Update toolhead
    if (toolhead) {
      GeneralVariablesStore.controlStatus.max_print_size =
        toolhead.axis_maximum || GeneralVariablesStore.controlStatus.max_print_size
      GeneralVariablesStore.controlStatus.min_print_size =
        toolhead.axis_minimum || GeneralVariablesStore.controlStatus.min_print_size
      GeneralVariablesStore.controlStatus.homed_axes =
        toolhead.homed_axes || GeneralVariablesStore.controlStatus.homed_axes
      GeneralVariablesStore.controlStatus.max_accel =
        toolhead.max_accel || GeneralVariablesStore.controlStatus.max_accel
      GeneralVariablesStore.controlStatus.max_velocity =
        toolhead.max_velocity || GeneralVariablesStore.controlStatus.max_velocity
      GeneralVariablesStore.controlStatus.stalls =
        toolhead.stalls || GeneralVariablesStore.controlStatus.stalls
    }

    // Update motion_report
    if (motion_report) {
      GeneralVariablesStore.controlStatus.current_position =
        motion_report.live_position || GeneralVariablesStore.controlStatus.current_position
      GeneralVariablesStore.controlStatus.live_velocity =
        motion_report.live_velocity || GeneralVariablesStore.controlStatus.live_velocity
      GeneralVariablesStore.controlStatus.live_extruder_velocity =
        motion_report.live_extruder_velocity ||
        GeneralVariablesStore.controlStatus.live_extruder_velocity

      if (GeneralVariablesStore.controlStatus.live_extruder_velocity > 0) {
        GeneralVariablesStore.controlStatus.flow_rate =
          Math.PI *
          Math.pow(GeneralVariablesStore.filamentDiameter.value / 2, 2) *
          GeneralVariablesStore.controlStatus.live_extruder_velocity
      }
    }

    // Update hotend Fan
    if (hotendFan) {
      GeneralVariablesStore.fanStatus.hotend_fan = hotendFan.speed
    }

    // Update layer blower
    if (layerBlower) {
      GeneralVariablesStore.fanStatus.layer_blower = layerBlower.speed
    }

    // Update aux blower
    if (auxBlower) {
      GeneralVariablesStore.fanStatus.aux_blower = auxBlower.speed
    }

    // Update LED
    if (led) {
      if (led.speed > 0) {
        GeneralVariablesStore.controlStatus.led = true
      } else {
        GeneralVariablesStore.controlStatus.led = false
      }
    }

    GeneralVariablesStore.isPrinterSubscribe = true
  }

  // Subscription
  function subscribeToPrinterInfo() {
    websocketStore
      .sendMessage('printer.objects.subscribe', {
        objects: {
          print_stats: [
            'filename',
            'state',
            'progress',
            'total_duration',
            'print_duration',
            'filament_used',
            'total_layer',
            'current_layer',
          ],
          gcode_move: ['speed_factor', 'extrude_factor'],
          heater_bed: ['temperature', 'target', 'status'],
          extruder: ['temperature', 'target', 'status'],
          toolhead: [
            'axis_maximum',
            'axis_minimum',
            'homed_axes',
            'max_accel',
            'max_velocity',
            'stalls',
          ],
          motion_report: ['live_extruder_velocity', 'live_position', 'live_velocity'],
          'heater_fan hotend_fan': ['speed'],
          'fan_generic layer_blower': ['speed'],
          'fan_generic aux_blower_1': ['speed'],
          'fan_generic aux_blower_2': ['speed'],
          'fan_generic aux_blower_3': ['speed'],
          'fan_generic my_led': ['speed'],
          'filament_switch_sensor mode_standard': null,
          'filament_switch_sensor mode_45_degrees': null,
          'filament_switch_sensor cutting_sensor': null,
          'filament_switch_sensor filament': null,
        },
      })
      .then((response) => {
        handlePrinterData(response.result.status)
      })
      .catch((error) => {
        ModalStore.showErrorModal('Failed to get Websocket Subscriptions: ' + error.message)
        console.log(error)
      })
  }

  // Getters
  function getPrinterObjects() {
    websocketStore
      .sendMessage('printer.objects.list')
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        ModalStore.showErrorModal('Failed to get printer objects: ' + error.message)
      })
  }

  function getHistoryTemperatures() {
    websocketStore
      .sendMessage('server.temperature_store')
      .then((response) => {
        handlePrinterData(response.result)
      })
      .catch((error) => {
        ModalStore.showErrorModal('Failed to get Historical Temperatures: ' + error.message)
      })
  }

  //Actions
  function setLayerFanSpeed(speed_change) {
    // Ensure the fan value stays within 0–1
    const speed = Math.min(1, Math.max(0, speed_change))

    websocketStore
      .sendMessage('printer.gcode.script', {
        script: `SET_FAN_SPEED FAN=layer_blower SPEED=${speed}`,
      })
      .catch((error) => {
        ModalStore.showErrorModal('Failed to set Layer Blower fan speed: ' + error.message)
      })
  }

  function setAuxBlowerFanSpeed(speed_change) {
    // Ensure the fan value stays within 0–1
    const speed = Math.min(1, Math.max(0, speed_change))

    websocketStore
      .sendMessage('printer.gcode.script', {
        script: `SET_FAN_SPEED FAN=aux_blower_1 SPEED=${speed}`,
      })
      .catch((error) => {
        ModalStore.showErrorModal('Failed to set Aux Blower 1: ' + error.message)
      })
    websocketStore
      .sendMessage('printer.gcode.script', {
        script: `SET_FAN_SPEED FAN=aux_blower_2 SPEED=${speed}`,
      })
      .catch((error) => {
        ModalStore.showErrorModal('Failed to set Aux Blower 2: ' + error.message)
      })
    websocketStore
      .sendMessage('printer.gcode.script', {
        script: `SET_FAN_SPEED FAN=aux_blower_3 SPEED=${speed}`,
      })
      .catch((error) => {
        ModalStore.showErrorModal('Failed to set Aux Blower 3: ' + error.message)
      })
  }

  function setBedTemperature(target_temperature) {
    const maxBedTemp = GeneralVariablesStore.database.motion.default_max_bed_temp.value || 120
    if (target_temperature > maxBedTemp) {
      target_temperature = maxBedTemp
    }
    websocketStore
      .sendMessage('printer.gcode.script', {
        script: `SET_HEATER_TEMPERATURE HEATER=heater_bed TARGET=${target_temperature}`,
      })
      .then(() => {
        if (target_temperature > 0) {
          GeneralVariablesStore.temperatureStatus.bed_status_temp = true
        } else {
          GeneralVariablesStore.temperatureStatus.bed_status_temp = false
        }
      })
      .catch((error) => {
        ModalStore.showErrorModal('Failed to set bed temperature: ' + error.message)
      })
  }

  function setHotendTemperature(target_temperature) {
    const maxHotendTemp = GeneralVariablesStore.database.motion.default_max_hotend_temp.value || 350
    if (target_temperature > maxHotendTemp) {
      target_temperature = maxHotendTemp
    }
    websocketStore
      .sendMessage('printer.gcode.script', {
        script: `SET_HEATER_TEMPERATURE HEATER=extruder TARGET=${target_temperature}`,
      })
      .then(() => {
        GeneralVariablesStore.temperatureStatus.hotend_status_temp = true
      })
      .catch((error) => {
        ModalStore.showErrorModal('Failed to set toolhead temperature: ' + error.message)
      })
  }

  function offBedTemperature() {
    websocketStore
      .sendMessage('printer.gcode.script', {
        script: `SET_HEATER_TEMPERATURE HEATER=heater_bed TARGET=0`,
      })
      .then(() => {
        GeneralVariablesStore.temperatureStatus.bed_status_temp = false
      })
      .catch((error) => {
        ModalStore.showErrorModal('Failed turn off bed temperature: ' + error.message)
      })
  }

  function offHotendTemperature() {
    websocketStore
      .sendMessage('printer.gcode.script', {
        script: `SET_HEATER_TEMPERATURE HEATER=extruder TARGET=0`,
      })
      .then(() => {
        GeneralVariablesStore.temperatureStatus.hotend_status_temp = false
      })
      .catch((error) => {
        ModalStore.showErrorModal('Failed turn off toolhead temperature: ' + error.message)
      })
  }

  function offHeaters() {
    websocketStore
      .sendMessage('printer.gcode.script', {
        script: `TURN_OFF_HEATERS`,
      })
      .catch((error) => {
        ModalStore.showErrorModal('Failed turn off heaters: ' + error.message)
      })
  }

  function setAbsoluteAxes() {
    return new Promise((resolve, reject) => {
      websocketStore
        .sendMessage('printer.gcode.script', {
          script: `G90`,
        })
        .then(() => resolve())
        .catch((error) => {
          console.error('Failed set absolute axes position: ' + error.message)
          reject(error)
        })
    })
  }

  function setRelativeAxes() {
    return new Promise((resolve, reject) => {
      websocketStore
        .sendMessage('printer.gcode.script', {
          script: `G91`,
        })
        .then(() => resolve())
        .catch((error) => {
          console.error('Failed set relative axes position: ' + error.message)
          reject(error)
        })
    })
  }

  function setHomeX() {
    return new Promise((resolve, reject) => {
      websocketStore
        .sendMessage('printer.gcode.script', {
          script: 'G28 X',
        })
        .then(() => resolve())
        .catch((error) => {
          ModalStore.showErrorModal('Failed to home X Axes: ' + error.message)
          reject(error)
        })
    })
  }

  function setHomeY() {
    return new Promise((resolve, reject) => {
      websocketStore
        .sendMessage('printer.gcode.script', {
          script: 'G28 Y',
        })
        .then(() => resolve())
        .catch((error) => {
          ModalStore.showErrorModal('Failed to home Y Axes: ' + error.message)
          reject(error)
        })
    })
  }

  function setHomeFull() {
    return new Promise((resolve, reject) => {
      websocketStore
        .sendMessage('printer.gcode.script', {
          script: 'G28',
        })
        .then(() => resolve())
        .catch((error) => {
          ModalStore.showErrorModal('Error during homing: ' + error.message)
          reject(error)
        })
    })
  }

  function moveXaxes(
    distance,
    speed = GeneralVariablesStore.database.motion.default_XY_speed.value,
  ) {
    return new Promise((resolve, reject) => {
      const newPosition =
        Math.round(GeneralVariablesStore.controlStatus.current_position[0]) + distance
      const position = Math.min(
        GeneralVariablesStore.controlStatus.max_print_size[0],
        Math.max(0, newPosition),
      )

      websocketStore
        .sendMessage('printer.gcode.script', {
          script: `G0 X${position} F${speed}`,
        })
        .then(() => resolve())
        .catch((error) => {
          ModalStore.showErrorModal('Failed to move X-axis: ' + error.message)
          reject(error)
        })
    })
  }

  function moveYaxes(
    distance,
    speed = GeneralVariablesStore.database.motion.default_XY_speed.value,
  ) {
    return new Promise((resolve, reject) => {
      const newPosition =
        Math.round(GeneralVariablesStore.controlStatus.current_position[1]) + distance
      const position = Math.min(
        GeneralVariablesStore.controlStatus.max_print_size[1],
        Math.max(0, newPosition),
      )

      websocketStore
        .sendMessage('printer.gcode.script', {
          script: `G0 Y${position} F${speed}`,
        })
        .then(() => resolve())
        .catch((error) => {
          ModalStore.showErrorModal('Failed to move Y-axis: ' + error.message)
          reject(error)
        })
    })
  }

  function moveXYAbsoluteAxes(
    positionX,
    positionY,
    speed = GeneralVariablesStore.database.motion.default_XY_speed.value,
  ) {
    return new Promise((resolve, reject) => {
      const new_positionX = Math.min(
        GeneralVariablesStore.controlStatus.max_print_size[0],
        Math.max(0, positionX),
      )

      const new_positionY = Math.min(
        GeneralVariablesStore.controlStatus.max_print_size[1],
        Math.max(0, positionY),
      )

      websocketStore
        .sendMessage('printer.gcode.script', {
          script: `G0 X${new_positionX} Y${new_positionY} F${speed}`,
        })
        .then(() => resolve())
        .catch((error) => {
          ModalStore.showErrorModal('Failed to move XY-axis: ' + error.message)
          reject(error)
        })
    })
  }

  function moveZaxes(
    distance,
    speed = GeneralVariablesStore.database.motion.default_Z_speed.value,
  ) {
    return new Promise((resolve, reject) => {
      const newPosition =
        Math.round(GeneralVariablesStore.controlStatus.current_position[2]) + distance
      const position = Math.min(
        GeneralVariablesStore.controlStatus.max_print_size[2],
        Math.max(0, newPosition),
      )

      websocketStore
        .sendMessage('printer.gcode.script', {
          script: `G0 Z${position} F${speed}`,
        })
        .then(() => resolve())
        .catch((error) => {
          ModalStore.showErrorModal('Failed to move Z-axis: ' + error.message)
          reject(error)
        })
    })
  }

  function moveExtruder(
    distance,
    speed = GeneralVariablesStore.database.motion.default_extruder_speed.value,
  ) {
    return new Promise((resolve, reject) => {
      const newExtruderPosition =
        Math.round(GeneralVariablesStore.controlStatus.current_position[3]) + distance

      websocketStore
        .sendMessage('printer.gcode.script', {
          script: `G1 E${newExtruderPosition} F${speed}`,
        })
        .then(() => resolve())
        .catch((error) => {
          ModalStore.showErrorModal('Failed to move extruder: ' + error.message)
          reject(error)
        })
    })
  }

  function moveBelt(
    distance,
    speed = GeneralVariablesStore.database.motion.default_belt_speed.value,
  ) {
    return new Promise((resolve, reject) => {
      websocketStore
        .sendMessage('printer.gcode.script', {
          script: `MANUAL_STEPPER STEPPER=belt MOVE=${distance} SPEED=${speed}`,
        })
        .then(() => {
          websocketStore
            .sendMessage('printer.gcode.script', {
              script: `MANUAL_STEPPER STEPPER=belt SET_POSITION=0`,
            })
            .then(() => resolve())
            .catch((error) => {
              ModalStore.showErrorModal('Failed during belt motion: ' + error.message)
              reject(error)
            })
        })
        .catch((error) => {
          ModalStore.showErrorModal('Failed to move belt: ' + error.message)
          reject(error)
        })
    })
  }

  function setLED() {
    if (GeneralVariablesStore.controlStatus.led == false) {
      websocketStore
        .sendMessage('printer.gcode.script', {
          script: `SET_FAN_SPEED FAN="my_led" SPEED=1`,
        })
        .catch((error) => {
          ModalStore.showErrorModal('Failed to turn on LED: ' + error.message)
        })
    } else {
      websocketStore
        .sendMessage('printer.gcode.script', {
          script: `SET_FAN_SPEED FAN="my_led" SPEED=0`,
        })
        .catch((error) => {
          ModalStore.showErrorModal('Failed to turn on LED: ' + error.message)
        })
    }
  }

  // Calibration functions
  async function calibrationHomingPrecision() {
    for (let i = 0; i < 5; i++) {
      await setHomeFull()
      console.log(`Homing iteration ${i + 1}`)
      await new Promise((resolve) => setTimeout(resolve, 5000))
    }
    ModalStore.closeModalSuccess('Completed homing precision check')
  }

  async function calibrationXYPrecision(repetitions) {
    let speed = 18000
    await setHomeX()
    await setHomeY()
    await setAbsoluteAxes()
    console.log('Set absolute axes.')
    for (let i = 1; i <= repetitions; i++) {
      await moveXYAbsoluteAxes(10, 10, speed)
      await moveXYAbsoluteAxes(120, 120, speed)
      await moveXYAbsoluteAxes(10, 10, speed)
      await moveXYAbsoluteAxes(120, 120, speed)
      await moveXYAbsoluteAxes(10, 10, speed)
      await moveXYAbsoluteAxes(120, 120, speed)
      console.log(`XY ${i} repetition at ${speed} mm/min`)
      await new Promise((resolve) => setTimeout(resolve, 10000))
    }
    await setRelativeAxes()
    console.log('relative axes set')
    ModalStore.showSuccessModal('Completed homing precision check')
  }

  return {
    //getters
    initPrinterLoad,
    getPrinterObjects,
    handlePrinterData,
    //actions
    setLayerFanSpeed,
    setAuxBlowerFanSpeed,
    setHotendTemperature,
    setBedTemperature,
    offBedTemperature,
    offHotendTemperature,
    offHeaters,
    setHomeX,
    setHomeY,
    moveXYAbsoluteAxes,
    setHomeFull,
    moveXaxes,
    moveYaxes,
    moveZaxes,
    moveExtruder,
    moveBelt,
    setLED,
    calibrationHomingPrecision,
    calibrationXYPrecision,
  }
})
