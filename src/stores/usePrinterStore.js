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
        if (GeneralVariablesStore.isDatabaseLoaded) {
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
        console.log('Printer Subscribed')
      })
      .catch((error) => {
        ModalStore.showErrorModal('Database is not loading: ' + error.message)
      })
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
        GeneralVariablesStore.handlePrinterData(response.result.status)
      })
      .catch((error) => {
        ModalStore.showErrorModal('Failed to get Websocket Subscriptions: ' + error.message)
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
        GeneralVariablesStore.handlePrinterData(response.result)
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
        GeneralVariablesStore.temperatureStatus.bed_status_temp = true
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

  function setHomeX() {
    websocketStore
      .sendMessage('printer.gcode.script', {
        script: 'G28 X',
      })
      .catch((error) => {
        if (!error.message.includes('timed out')) {
          ModalStore.showErrorModal('Failed to home X Axes: ' + error.message)
        }
      })
  }

  function setHomeY() {
    websocketStore
      .sendMessage('printer.gcode.script', {
        script: 'G28 Y',
      })
      .catch((error) => {
        if (!error.message.includes('timed out')) {
          ModalStore.showErrorModal('Failed to home Y Axes: ' + error.message)
        }
      })
  }

  function setHomeFull() {
    websocketStore
      .sendMessage('printer.gcode.script', {
        script: 'G28',
      })
      .catch((error) => {
        if (!error.message.includes('timed out')) {
          ModalStore.showErrorModal('Error during homing: ' + error.message)
        }
      })
  }

  function moveXaxes(distance) {
    // Ensure the position is between printer configuration
    const newPosition =
      Math.round(GeneralVariablesStore.controlStatus.current_position[0]) + distance
    const position = Math.min(
      GeneralVariablesStore.controlStatus.max_print_size[0],
      Math.max(0, newPosition),
    )

    websocketStore
      .sendMessage('printer.gcode.script', {
        script: `G0 X${position} F${GeneralVariablesStore.database.motion.default_XY_speed.value}`,
      })
      .catch((error) => {
        ModalStore.showErrorModal('Failed to move X-axis: ' + error.message)
      })
  }

  function moveYaxes(distance) {
    // Ensure the position is between printer configuration
    const newPosition =
      Math.round(GeneralVariablesStore.controlStatus.current_position[1]) + distance
    const position = Math.min(
      GeneralVariablesStore.controlStatus.max_print_size[1],
      Math.max(0, newPosition),
    )

    websocketStore
      .sendMessage('printer.gcode.script', {
        script: `G0 Y${position} F${GeneralVariablesStore.database.motion.default_XY_speed.value}`,
      })
      .catch((error) => {
        ModalStore.showErrorModal('Failed to move Y-axis: ' + error.message)
      })
  }

  function moveZaxes(distance) {
    // Ensure the position is between printer configuration
    const newPosition =
      Math.round(GeneralVariablesStore.controlStatus.current_position[2]) + distance
    const position = Math.min(
      GeneralVariablesStore.controlStatus.max_print_size[2],
      Math.max(0, newPosition),
    )

    websocketStore
      .sendMessage('printer.gcode.script', {
        script: `G0 Z${position} F${GeneralVariablesStore.database.motion.default_Z_speed.value}`,
      })
      .catch((error) => {
        ModalStore.showErrorModal('Failed to move Z-axis: ' + error.message)
      })
  }

  function moveExtruder(distance) {
    // Calculate the new extruder position based on the current position and desired distance
    const newExtruderPosition =
      Math.round(GeneralVariablesStore.controlStatus.current_position[3]) + distance

    // Send the command to move the extruder motor
    websocketStore
      .sendMessage('printer.gcode.script', {
        script: `G1 E${newExtruderPosition} F${GeneralVariablesStore.database.motion.default_extruder_speed.value}`,
      })
      .catch((error) => {
        ModalStore.showErrorModal('Failed to move extruder: ' + error.message)
      })
  }

  function moveBelt(distance) {
    // Send the command to move the belt motor
    websocketStore
      .sendMessage('printer.gcode.script', {
        script: `MANUAL_STEPPER STEPPER=belt MOVE=${distance} SPEED=${GeneralVariablesStore.database.motion.default_belt_speed.value}`,
      })
      .then(() => {
        websocketStore
          .sendMessage('printer.gcode.script', {
            script: `MANUAL_STEPPER STEPPER=belt SET_POSITION=0`,
          })
          .catch((error) => {
            ModalStore.showErrorModal('Failed during belt motion: ' + error.message)
          })
      })
      .catch((error) => {
        ModalStore.showErrorModal('Failed to move belt: ' + error.message)
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

  return {
    //getters
    initPrinterLoad,
    getPrinterObjects,
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
    setHomeFull,
    moveXaxes,
    moveYaxes,
    moveZaxes,
    moveExtruder,
    moveBelt,
    setLED,
  }
})
