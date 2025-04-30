import { defineStore } from 'pinia'
import { useWebsocketStore } from './useWebsocketStore'
import { useModalStore } from './useModalStore'
import { useGeneralVariablesStore } from './useGeneralVariablesStore'
import { usePrintFilesStore } from './usePrintFilesStore'

export const usePrinterStore = defineStore('printer', () => {
  // Imported Variables
  const websocketStore = useWebsocketStore()
  const ModalStore = useModalStore()
  const GeneralVariablesStore = useGeneralVariablesStore()
  const PrintFilesStore = usePrintFilesStore()

  /////////////////////////////////
  // Initialize
  /////////////////////////////////
  function initPrinterLoad() {
    const waitForConnection = new Promise((resolve) => {
      const checkConnection = setInterval(() => {
        if (
          GeneralVariablesStore.isDatabaseLoaded &&
          GeneralVariablesStore.isWebsocketConnected &&
          GeneralVariablesStore.isMoonrakerConnected
        ) {
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
        getWebcams()
        loadBedMesh()
        console.log('Printer Subscribed')
      })
      .catch((error) => {
        ModalStore.showErrorModal('Unable to initialize printer subscription: ' + error.message)
      })
  }

  /////////////////////////////////
  // Handle
  /////////////////////////////////
  async function handlePrinterData(data) {
    const {
      print_stats,
      display_status,
      gcode_move,
      heater_bed,
      extruder,
      toolhead,
      motion_report,
      fan,
      bed_mesh,
    } = data
    const hotendFan = data['heater_fan hotend_fan']
    const auxBlower = data['fan_generic aux_blower']
    const led = data['output_pin my_led']
    const endStop_standard = data['filament_switch_sensor mode_standard']
    const endStop_45_degrees = data['filament_switch_sensor mode_45_degrees']
    const endStop_filament_cut = data['filament_switch_sensor cutting_sensor']
    const endStop_filament = data['filament_switch_sensor filament']
    const temperature_fan_mcu = data['temperature_fan mcu']

    if (bed_mesh) {
      const z = bed_mesh.mesh_matrix
      const x = Array.from({ length: z[0].length }, (_, i) => i) // can be adjusted to real X coords
      const y = Array.from({ length: z.length }, (_, i) => i) // same for Y coords

      GeneralVariablesStore.controlStatus.bed_mesh = [
        {
          z: z,
          x: x,
          y: y,
          type: 'surface',
        },
      ]
    }

    //End stops
    if (endStop_standard) {
      GeneralVariablesStore.printerConfig.position_standard = endStop_standard.filament_detected
      GeneralVariablesStore.checkPrinterConfig()
    }
    if (endStop_45_degrees) {
      GeneralVariablesStore.printerConfig.position_45 = endStop_45_degrees.filament_detected
      GeneralVariablesStore.checkPrinterConfig()
    }
    if (endStop_filament) {
      GeneralVariablesStore.controlStatus.filament_sensor = endStop_filament.filament_detected
    }
    if (endStop_filament_cut) {
      GeneralVariablesStore.controlStatus.filament_cut = endStop_filament_cut.filament_detected
    }

    // print_stats
    if (print_stats) {
      GeneralVariablesStore.printJobStatus.state =
        print_stats.state || GeneralVariablesStore.printJobStatus.state
      GeneralVariablesStore.printJobStatus.total_duration =
        print_stats.total_duration || GeneralVariablesStore.printJobStatus.total_duration
      GeneralVariablesStore.printJobStatus.print_duration =
        print_stats.print_duration || GeneralVariablesStore.printJobStatus.print_duration
      GeneralVariablesStore.printJobStatus.filament_used_mm =
        print_stats.filament_used || GeneralVariablesStore.printJobStatus.filament_used_mm
      if (print_stats.info) {
        GeneralVariablesStore.printJobStatus.total_layer =
          print_stats.info.total_layer || GeneralVariablesStore.printJobStatus.total_layer
        GeneralVariablesStore.printJobStatus.current_layer =
          print_stats.info.current_layer || GeneralVariablesStore.printJobStatus.current_layer
      }

      if (
        print_stats.filename &&
        print_stats.filename != GeneralVariablesStore.printJobStatus.filename
      ) {
        GeneralVariablesStore.printJobStatus.filename = print_stats.filename
        const metaData = await PrintFilesStore.loadMetaData(
          GeneralVariablesStore.printJobStatus.filename,
        )
        if (metaData) {
          GeneralVariablesStore.printJobStatus.job_thumbnail = metaData.thumbnails
        }
      }
    }

    // display_status (job progress)
    if (display_status) {
      GeneralVariablesStore.printJobStatus.progress =
        display_status.progress || GeneralVariablesStore.printJobStatus.progress
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
    }

    // gcode_move (speed and extrude factor)
    if (gcode_move) {
      GeneralVariablesStore.printJobStatus.speed_factor =
        gcode_move.speed_factor || GeneralVariablesStore.printJobStatus.speed_factor
      GeneralVariablesStore.printJobStatus.extruder_factor =
        gcode_move.extrude_factor || GeneralVariablesStore.printJobStatus.extruder_factor
    }

    // Heater_bed
    if (heater_bed) {
      GeneralVariablesStore.temperatureStatus.bed_current_temp =
        heater_bed.temperature || GeneralVariablesStore.temperatureStatus.bed_current_temp
      if (heater_bed.target) {
        console.log(
          'temperature before: ' + GeneralVariablesStore.temperatureStatus.bed_target_temp,
        )
        GeneralVariablesStore.temperatureStatus.bed_target_temp =
          heater_bed.target || GeneralVariablesStore.temperatureStatus.bed_target_temp
        console.log('temperature after: ' + GeneralVariablesStore.temperatureStatus.bed_target_temp)
      }
      if (heater_bed.power) {
        GeneralVariablesStore.temperatureStatus.bed_power = heater_bed.power * 100
      }
      // Historic
      if (heater_bed.temperatures) {
        GeneralVariablesStore.temperatureStatus.bed_historic_temp = heater_bed.temperatures.slice(
          -GeneralVariablesStore.temperatureStatus.maximum_history_values,
        )
      }
    }

    // Update extruder
    if (extruder) {
      GeneralVariablesStore.temperatureStatus.hotend_current_temp =
        extruder.temperature || GeneralVariablesStore.temperatureStatus.hotend_current_temp
      GeneralVariablesStore.temperatureStatus.hotend_target_temp =
        extruder.target || GeneralVariablesStore.temperatureStatus.hotend_target_temp
      if (extruder.power) {
        GeneralVariablesStore.temperatureStatus.hotend_power = extruder.power * 100
      }
      // Historic
      if (extruder.temperatures) {
        GeneralVariablesStore.temperatureStatus.hotend_historic_temp = extruder.temperatures.slice(
          -GeneralVariablesStore.temperatureStatus.maximum_history_values,
        )
      }
    }

    // Toolhead
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
          Math.pow(GeneralVariablesStore.filamentDiameter / 2, 2) *
          GeneralVariablesStore.controlStatus.live_extruder_velocity
      }
    }

    // Fans
    if (hotendFan) {
      GeneralVariablesStore.fanStatus.hotend_fan = hotendFan.speed
    }
    if (fan) {
      GeneralVariablesStore.fanStatus.layer_blower = fan.speed
    }
    if (auxBlower) {
      GeneralVariablesStore.fanStatus.aux_blower = auxBlower.speed
    }
    if (temperature_fan_mcu) {
      GeneralVariablesStore.temperatureStatus.electronics_temp = temperature_fan_mcu.temperature

      if (temperature_fan_mcu.temperatures) {
        GeneralVariablesStore.temperatureStatus.electronics_historic_temp =
          temperature_fan_mcu.temperatures.slice(
            -GeneralVariablesStore.temperatureStatus.maximum_history_values,
          )
      }
    }

    // LED
    if (led) {
      if (led.value == 1) {
        GeneralVariablesStore.controlStatus.led = false
      } else {
        GeneralVariablesStore.controlStatus.led = true
      }
    }
    GeneralVariablesStore.isPrinterSubscribe = true
  }

  /////////////////////////////////
  // Subscription
  /////////////////////////////////
  function subscribeToPrinterInfo() {
    websocketStore
      .sendMessage('printer.objects.subscribe', {
        objects: {
          print_stats: [
            'filename',
            'total_duration',
            'print_duration',
            'filament_used',
            'state',
            'info',
          ],
          display_status: ['message', 'progress'],
          gcode_move: ['speed_factor', 'extrude_factor'],
          heater_bed: ['temperature', 'target', 'power'],
          extruder: ['temperature', 'target', 'power'],
          'temperature_fan mcu': null,
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
          fan: ['speed'],
          'fan_generic aux_blower': ['speed'],
          'output_pin my_led': ['value'],
          'filament_switch_sensor mode_standard': ['filament_detected'],
          'filament_switch_sensor mode_45_degrees': ['filament_detected'],
          'filament_switch_sensor cutting_sensor': ['filament_detected'],
          'filament_switch_sensor filament': ['filament_detected'],
          'filament_switch_sensor door': ['filament_detected'],
          bed_mesh: null,
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

  function loadBedMesh() {
    websocketStore
      .sendMessage('printer.gcode.script', {
        script: `BED_MESH_PROFILE LOAD=default`,
      })
      .then(() => {
        console.log('Bed mesh loaded')
      })
      .catch((error) => {
        console.log(error)
      })
  }

  /////////////////////////////////
  // Getters
  /////////////////////////////////
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

  function getWebcams() {
    websocketStore
      .sendMessage('server.webcams.list')
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

  return {
    //getters
    initPrinterLoad,
    getPrinterObjects,
    handlePrinterData,
  }
})
