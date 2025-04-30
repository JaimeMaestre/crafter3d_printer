import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { useMoonrakerStore } from './useMoonrakerStore'
import { useDatabaseStore } from './useDatabaseStore'
import { useCrafterAPIStore } from './useCrafterAPIStore'

export const useGeneralVariablesStore = defineStore('generalVariables', () => {
  const MoonrakerStore = useMoonrakerStore()
  const DatabaseStore = useDatabaseStore()
  const CrafterAPIStore = useCrafterAPIStore()

  //// Variables layout /////
  const side_menu_visibility = ref(false)
  const printerAxesConfigError = ref(false)

  //// Websocket /////
  const isWebsocketConnected = ref(false)
  const WebsockeMessages = reactive([]) //Revisar donde se usa....

  // System Stats
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
    listUSB: [],
  })

  //// Database /////
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
        value: 300, // 300mm/min - 5mm/s
        unit: 'mm/min',
        icon: 'gears',
        translationKey: 'ext_speed',
      },
      default_belt_speed: {
        value: 50, // 60mm/min - 1mm/s
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

  //// Moonraker Server /////
  const isMoonrakerConnected = ref(false)
  const mcuStatus = reactive({
    hostname: '',
    klippy: '',
    mcu_state: 'Service not active',
    status: '',
    warnnings: [],
    klipper_version: '',
    moonraker_version: '',
  })

  //// Printer /////
  const gcodeHistory = ref([])
  const printerConfigStandardPosition = ref(true)
  const isPrinterSubscribe = ref(false)
  const filamentDiameter = 1.75 //mm
  const filamentDensity = 0.00124 //g/mm3
  const printJobStatus = reactive({
    filename: '',
    state: 'standby',
    progress: 0,
    total_duration: 0,
    print_duration: 0,
    time_left: 0,
    filament_used_mm: 0,
    total_layer: 0,
    current_layer: 0,
    speed_factor: 1,
    extruder_factor: 1,
    job_thumbnail: '',
  })
  const temperatureStatus = reactive({
    bed_power: 0,
    bed_current_temp: -30.0,
    bed_target_temp: 0,
    bed_historic_temp: [],
    hotend_power: 0,
    hotend_current_temp: -30.0,
    hotend_target_temp: 0,
    hotend_historic_temp: [],
    maximum_history_values: 600,
    electronics_temp: -30.0,
    electronics_historic_temp: [],
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
    door_sensor: false,
    z_offset: 0,
    bed_mesh: [],
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

  //// Print files /////
  const latestPrintFiles = ref([])
  const allPrintFiles = ref([])
  const queueJobs = ref([])
  const queueStatus = ref('')

  //// Helpers Methods /////
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
      CrafterAPIStore.togglePrinterStandardConfig()
      MoonrakerStore.resetFirmware()
      database.printerAxesPositionStandard = true
      DatabaseStore.updateDatabase()
    } else if (
      printerConfig.position_45 === true &&
      printerConfig.position_45 == database.printerAxesPositionStandard
    ) {
      printerAxesConfigError.value = false
      console.log('Changin printer.cfg to infinite-z')
      CrafterAPIStore.togglePrinterInfiniteZConfig()
      MoonrakerStore.resetFirmware()
      database.printerAxesPositionStandard = false
      DatabaseStore.updateDatabase()
    } else {
      printerAxesConfigError.value = false
    }
  }

  function filamentWeight(length) {
    const filamentArea = Math.PI * Math.pow(filamentDiameter / 2, 2)
    const filamentVolume = filamentArea * length
    const filamentWeight = filamentVolume * filamentDensity
    return filamentWeight
  }

  return {
    // Methods
    formatTime,
    formatPrintTime,
    formatFileTime,
    checkPrinterConfig,
    filamentWeight,
    // layout
    side_menu_visibility,
    printerAxesConfigError,
    // Websocket
    isWebsocketConnected,
    WebsockeMessages,
    // System Stats
    systemStats,
    // Database
    isDatabaseLoaded,
    database,
    // Moonraker Server
    isMoonrakerConnected,
    mcuStatus,
    // Printer
    gcodeHistory,
    printerConfigStandardPosition,
    isPrinterSubscribe,
    filamentDiameter,
    filamentDensity,
    printJobStatus,
    temperatureStatus,
    controlStatus,
    fanStatus,
    printerConfig,
    // Prin Files
    latestPrintFiles,
    allPrintFiles,
    queueJobs,
    queueStatus,
  }
})
