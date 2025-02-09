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

  function checkPrinterConfig() {
    if (printerConfig.position_standard === printerConfig.position_45) {
      printerAxesConfigError.value = true
    } else if (
      printerConfig.position_standard &&
      printerConfig.position_standard != database.printerAxesPositionStandard
    ) {
      printerAxesConfigError.value = false
      console.log('Changin printer.cfg to standard')
      ServerInfoStore.changePrinterCfg('config/printer_standard.cfg', 'config/printer.cfg')
      ServerInfoStore.resetFirmware()
      database.printerAxesPositionStandard = true
      DatabaseStore.updateDatabase()
    } else if (
      printerConfig.position_45 === true &&
      printerConfig.position_45 == database.printerAxesPositionStandard
    ) {
      printerAxesConfigError.value = false
      console.log('Changin printer.cfg to 45 degrees')
      ServerInfoStore.changePrinterCfg('config/printer_45.cfg', 'config/printer.cfg')
      ServerInfoStore.resetFirmware()
      database.printerAxesPositionStandard = false
      DatabaseStore.updateDatabase()
    }
  }

  return {
    // Methods
    formatTime,
    formatPrintTime,
    formatFileTime,
    checkPrinterConfig,
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
