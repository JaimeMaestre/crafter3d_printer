import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { useServerInfoStore } from './useServerInfoStore'
import { useDatabaseStore } from './useDatabaseStore'

export const useGeneralVariablesStore = defineStore('generalVariables', () => {
  const ServerInfoStore = useServerInfoStore()
  const DatabaseStore = useDatabaseStore()

  // Variables layout
  const side_menu_visibility = ref(false)
  const printerAxesConfigError = ref(false)

  // Moonraker API
  const hostname = ref('')
  const isWebsocketConnected = ref(false)
  const WebsockeMmessages = reactive([])

  // Variables Moonraker Server
  const mcuStatus = reactive({
    hostname: '',
    klippy: '',
    mcu_state: 'Service not active',
    status: '',
    warnnings: [],
    software: '',
  })

  // Variables Printer
  const printerConfigStandardPosition = ref(true)
  const isPrinterSubscribe = ref(false)
  const isHotendTarget = ref(false)
  const isBedTarget = ref(false)
  const filamentDiameter = ref(1.75) //mm
  const filamentDensity = ref(1.24) //g/cm3
  const printJobStatus = reactive({
    filename: '',
    state: 'Unknown',
    progress: 0,
    total_duration: 0,
    print_duration: 0,
    time_left: 0,
    filament_used_mm: 0,
    filament_used_g: 0,
    total_layer: 0,
    current_layer: 0,
    speed_factor: 1,
    extruder_factor: 1,
  })
  const temperatureStatus = reactive({
    bed_status_temp: false,
    bed_current_temp: -30,
    bed_target_temp: 0,
    bed_historic_temp: [],
    hotend_status_temp: false,
    hotend_current_temp: -30,
    hotend_target_temp: 0,
    hotend_historic_temp: [],
    maximum_history_values: 600,
  })
  const controlStatus = reactive({
    max_print_size: [0, 0, 0, 0],
    min_print_size: [0, 0, 0, 0],
    live_velocity: 0,
    live_extruder_velocity: 0,
    flow_rate: 0, //mm3/s
    homed_axes: '',
    max_velocity: 0,
    max_accel: 0,
    stalls: 0,
    current_position: [0, 0, 0, 0],
    led: false,
    filament_sensor: false,
    filament_cut: false,
  })
  const fanStatus = reactive({
    hotend_fan: 0,
    layer_blower: 0,
    aux_blower: 0,
  })
  const printerConfig = reactive({
    position_standard: true,
    position_45: false,
  })

  // Variable Crafter 3D Database
  const isDatabaseLoaded = ref(false)
  const database = reactive({
    heatProfiles: {
      PLA: { enabled: true, name: 'PLA', hotend_temperature: 210, bed_temperature: 60 },
      PETG: { enabled: true, name: 'PETG', hotend_temperature: 230, bed_temperature: 70 },
      ABS: { enabled: true, name: 'ABS', hotend_temperature: 260, bed_temperature: 90 },
      Custom: { enabled: false, name: 'Custom', hotend_temperature: 0, bed_temperature: 0 },
    },
    startUp: {
      light: { key: 'light', icon: 'lightbulb', value: false },
      homing: { key: 'homing', icon: 'house', value: false },
      beltThrow: { key: 'beltThrow', icon: 'circle-radiation', value: false },
    },
    printerAxesPositionStandard: true,
    motion: {
      default_XY_speed: {
        value: 3000, // 3000mm/min - 50mm/s
        unit: 'mm/min',
        icon: 'up-down-left-right',
        translationKey: 'xy_speed',
      },
      default_Z_speed: {
        value: 600, // 600mm/min - 10mm/s
        unit: 'mm/min',
        icon: 'up-down-left-right',
        translationKey: 'z_speed',
      },
      default_extruder_speed: {
        value: 600, // 600mm/min - 10mm/s
        unit: 'mm/min',
        icon: 'gears',
        translationKey: 'ext_speed',
      },
      default_belt_speed: {
        value: 60, // 60mm/min - 1mm/s
        unit: 'mm/min',
        icon: 'circle-radiation',
        translationKey: 'belt_speed',
      },
      default_max_hotend_temp: {
        value: 300,
        unit: 'ºC',
        icon: 'spray-can',
        translationKey: 'max_hotend_temp',
      },
      default_max_bed_temp: {
        value: 120,
        unit: 'ºC',
        icon: 'arrows-up-to-line',
        translationKey: 'max_bed_temp',
      },
      belt_throw_loop: {
        value: 1,
        unit: 'loop',
        icon: 'circle-radiation',
        translationKey: 'belt_throw_loop',
      },
    },
    others: {
      countLatestPrintFiles: 5,
      language: 'en',
    },
    languages: [
      { code: 'en', name: 'English' },
      { code: 'fr', name: 'French' },
      { code: 'it', name: 'Italian' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'es', name: 'Spanish' },
      { code: 'de', name: 'German' },
    ],
  })

  // Variables Print Files
  const latestPrintFiles = ref([])
  const allPrintFiles = ref([])

  // Variables Queue
  const queueJobs = ref([])
  const queueStatus = ref('Unkown')

  // Variables system state
  const systemStats = reactive({
    cpuTemp: 0, // in Celsius
    cpuUsage: 0, // percentage
    memoryUsage: {
      total: 0, // in kB
      used: 0, // in kB
      available: 0, // in kB
    },
    network: {
      wlan0: {
        bandwidth: 0, // in kB/s
        received: 0, // in MB
        transmitted: 0, // in MB
      },
    },
    websocketConnections: 0,
  })
  const listUSB = reactive([])

  // Helpers Methods
  function formatTime(seconds) {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  function formatPrintTime(seconds) {
    const h = (seconds / 3600).toFixed(2)
    if (h < 1) {
      const m = (seconds / 60).toFixed(0)
      return `${m.toString()} Min`
    } else {
      return `${h.toString()} Hours`
    }
  }

  function formatFileTime(time) {
    const date = new Date(time * 1000)
    const formattedDate = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).format(date)
    return formattedDate
  }

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
      printerConfig.position_standard = endStop_standard_config.filament_detected
      checkPrinterConfig()
    }

    if (endStop_45_degrees_config) {
      printerConfig.position_45 = endStop_45_degrees_config.filament_detected
      checkPrinterConfig()
    }

    if (endStop_filament) {
      controlStatus.filament_sensor = endStop_filament.filament_detected
    }

    if (endStop_filament_cut) {
      controlStatus.filament_cut = endStop_filament_cut.filament_detected
    }

    // Update print_stats
    if (print_stats) {
      printJobStatus.filename = print_stats.filename || printJobStatus.filename
      printJobStatus.state = print_stats.state || printJobStatus.state
      printJobStatus.progress = print_stats.progress || printJobStatus.progress
      printJobStatus.total_duration = print_stats.total_duration || printJobStatus.total_duration
      printJobStatus.print_duration = print_stats.print_duration || printJobStatus.print_duration
      printJobStatus.filament_used_mm = print_stats.filament_used || printJobStatus.filament_used_mm
      printJobStatus.total_layer = print_stats.total_layer || printJobStatus.total_layer
      printJobStatus.current_layer = print_stats.current_layer || printJobStatus.current_layer

      // Calculate time_left
      if (printJobStatus.progress > 0 && printJobStatus.print_duration > 0) {
        printJobStatus.time_left = printJobStatus.print_duration * (1 / printJobStatus.progress - 1)
      } else {
        printJobStatus.time_left = 0
      }

      // Calculate grams used
      if (printJobStatus.filament_used_mm > 0) {
        printJobStatus.filament_used_g =
          (printJobStatus.filament_used_mm *
            Math.PI *
            Math.pow(filamentDiameter.value / 2, 2) *
            filamentDensity.value) /
          1000
      }
    }

    // Update gcode_move
    if (gcode_move) {
      printJobStatus.speed_factor = gcode_move.speed_factor || printJobStatus.speed_factor
      printJobStatus.extruder_factor = gcode_move.extrude_factor || printJobStatus.extruder_factor
    }

    // Update heater_bed
    if (heater_bed) {
      temperatureStatus.bed_current_temp =
        heater_bed.temperature || temperatureStatus.bed_current_temp
      temperatureStatus.bed_target_temp = heater_bed.target || temperatureStatus.bed_target_temp
      temperatureStatus.bed_status_temp = heater_bed.status || temperatureStatus.bed_status_temp
      if (heater_bed.temperatures) {
        temperatureStatus.bed_historic_temp = heater_bed.temperatures.slice(
          -temperatureStatus.maximum_history_values,
        )
      }
      if (heater_bed.target) {
        isBedTarget.value = true
      }
    }

    // Update extruder
    if (extruder) {
      temperatureStatus.hotend_current_temp =
        extruder.temperature || temperatureStatus.hotend_current_temp
      temperatureStatus.hotend_target_temp = extruder.target || temperatureStatus.hotend_target_temp
      temperatureStatus.hotend_status_temp = extruder.status || temperatureStatus.hotend_status_temp
      if (extruder.temperatures) {
        temperatureStatus.hotend_historic_temp = extruder.temperatures.slice(
          -temperatureStatus.maximum_history_values,
        )
      }
      if (extruder.target) {
        isHotendTarget.value = true
      }
    }

    // Update toolhead
    if (toolhead) {
      controlStatus.max_print_size = toolhead.axis_maximum || controlStatus.max_print_size
      controlStatus.min_print_size = toolhead.axis_minimum || controlStatus.min_print_size
      controlStatus.homed_axes = toolhead.homed_axes || controlStatus.homed_axes
      controlStatus.max_accel = toolhead.max_accel || controlStatus.max_accel
      controlStatus.max_velocity = toolhead.max_velocity || controlStatus.max_velocity
      controlStatus.stalls = toolhead.stalls || controlStatus.stalls
    }

    // Update motion_report
    if (motion_report) {
      controlStatus.current_position = motion_report.live_position || controlStatus.current_position
      controlStatus.live_velocity = motion_report.live_velocity || controlStatus.live_velocity
      controlStatus.live_extruder_velocity =
        motion_report.live_extruder_velocity || controlStatus.live_extruder_velocity

      if (controlStatus.live_extruder_velocity > 0) {
        controlStatus.flow_rate =
          Math.PI * Math.pow(filamentDiameter.value / 2, 2) * controlStatus.live_extruder_velocity
      }
    }

    // Update hotend Fan
    if (hotendFan) {
      fanStatus.hotend_fan = hotendFan.speed
    }

    // Update layer blower
    if (layerBlower) {
      fanStatus.layer_blower = layerBlower.speed
    }

    // Update aux blower
    if (auxBlower) {
      fanStatus.aux_blower = auxBlower.speed
    }

    // Update LED
    if (led) {
      if (led.speed > 0) {
        controlStatus.led = true
      } else {
        controlStatus.led = false
      }
    }

    isPrinterSubscribe.value = true
  }

  function checkPrinterConfig() {
    if (printerConfig.position_standard === printerConfig.position_45) {
      printerAxesConfigError.value = true
    } else if (
      printerConfig.position_standard &&
      printerConfig.position_standard != database.printerAxesPositionStandard
    ) {
      console.log('Changin printer.cfg to standard')
      ServerInfoStore.changePrinterCfg('config/printer_standard.cfg', 'config/printer.cfg')
      ServerInfoStore.resetFirmware()
      database.printerAxesPositionStandard = true
      DatabaseStore.updateDatabase()
    } else if (
      printerConfig.position_45 === true &&
      printerConfig.position_45 == database.printerAxesPositionStandard
    ) {
      console.log('Changin printer.cfg to 45 degrees')
      ServerInfoStore.changePrinterCfg('config/printer_45.cfg', 'config/printer.cfg')
      ServerInfoStore.resetFirmware()
      database.printerAxesPositionStandard = false
      DatabaseStore.updateDatabase()
    }
  }

  function handleDatabase(data) {
    for (const key in data) {
      database[key] = data[key]
    }
  }

  function handleServerUpdate(data) {
    const { cpu_temp, moonraker_stats, system_memory, network, websocket_connections } = data

    // Update CPU temperature
    systemStats.cpuTemp = cpu_temp

    // Update CPU usage
    systemStats.cpuUsage = moonraker_stats?.cpu_usage || 0

    // Update Memory usage
    systemStats.memoryUsage.total = system_memory?.total || 0
    systemStats.memoryUsage.available = system_memory?.available || 0
    systemStats.memoryUsage.used = system_memory?.used || 0

    // Update Network stats for wlan0
    const wlan0 = network?.wlan0
    if (wlan0) {
      systemStats.network.wlan0.bandwidth = wlan0.bandwidth || 0
      systemStats.network.wlan0.received = wlan0.received || 0
      systemStats.network.wlan0.transmitted = wlan0.transmitted || 0
    }

    // Update WebSocket connections
    systemStats.websocketConnections = websocket_connections || 0
  }

  return {
    // Methods
    formatTime,
    formatPrintTime,
    formatFileTime,
    handlePrinterData,
    handleDatabase,
    handleServerUpdate,
    // layout
    side_menu_visibility,
    printerAxesConfigError,
    // Server Config
    hostname,
    // Websocket
    isWebsocketConnected,
    WebsockeMmessages,
    // Moonraker Server
    mcuStatus,
    // Printer
    printerConfigStandardPosition,
    isPrinterSubscribe,
    isHotendTarget,
    isBedTarget,
    filamentDiameter,
    filamentDensity,
    printJobStatus,
    temperatureStatus,
    controlStatus,
    fanStatus,
    printerConfig,
    // Crafter3D DB
    isDatabaseLoaded,
    database,
    // Prin Files
    latestPrintFiles,
    allPrintFiles,
    // Queue jobs
    queueJobs,
    queueStatus,
    // System state
    systemStats,
    listUSB,
  }
})
