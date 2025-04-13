import { defineStore } from 'pinia'
import { useWebsocketStore } from './useWebsocketStore'
import { useModalStore } from './useModalStore'
import { useGeneralVariablesStore } from './useGeneralVariablesStore'
import { useGcodeStore } from './useGcodeStore'

export const usePrinterStore = defineStore('printer', () => {
  // Imported Variables
  const websocketStore = useWebsocketStore()
  const ModalStore = useModalStore()
  const GeneralVariablesStore = useGeneralVariablesStore()
  const gCodeStore = useGcodeStore()

  // Initialize
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
        gCodeStore.startLED()
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
    const led = data['output_pin my_led']
    const endStop_standard = data['filament_switch_sensor mode_standard']
    const endStop_45_degrees = data['filament_switch_sensor mode_45_degrees']
    const endStop_filament_cut = data['filament_switch_sensor cutting_sensor']
    const endStop_filament = data['filament_switch_sensor filament']
    const endStop_door = data['filament_switch_sensor door']

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

    if (endStop_door) {
      GeneralVariablesStore.controlStatus.door_sensor = endStop_door.filament_detected
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
      if (led.value == 1) {
        GeneralVariablesStore.controlStatus.led = false
      } else {
        GeneralVariablesStore.controlStatus.led = true
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
          'output_pin my_led': ['value'],
          'filament_switch_sensor mode_standard': null,
          'filament_switch_sensor mode_45_degrees': null,
          'filament_switch_sensor cutting_sensor': null,
          'filament_switch_sensor filament': null,
          'filament_switch_sensor door': null,
          probe: ['last_z_result'],
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

  return {
    //getters
    initPrinterLoad,
    getPrinterObjects,
    handlePrinterData,
  }
})
