import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VChart from 'vue-echarts'

import App from './App.vue'
import router from './routes'
import i18n from './languages'
import './assets/main.css'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'

import { useWebsocketStore } from './stores/useWebsocketStore'
import { useMoonrakerStore } from './stores/useMoonrakerStore'
import { usePrinterStore } from './stores/usePrinterStore'
import { useDatabaseStore } from './stores/useDatabaseStore'
import { useJobQueueStore } from '@/stores/useJobQueueStore'
import { usePrintFilesStore } from '@/stores/usePrintFilesStore'
import { useGeneralVariablesStore } from '@/stores/useGeneralVariablesStore'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(i18n)
app.component('v-chart', VChart)
app.use(router)

// Import specific icons
import {
  faAngleDown,
  faBars,
  faCircleExclamation,
  faGlobe,
  faPlay,
  faPause,
  faStop,
  faFan,
  faClock,
  faHourglassStart,
  faLayerGroup,
  faBarsStaggered,
  faTape,
  faFile,
  faArrowsSpin,
  faHome,
  faLightbulb,
  faArrowsUpDownLeftRight,
  faCircleRadiation,
  faTemperatureThreeQuarters,
  faPlugCircleExclamation,
  faPlug,
  faChalkboard,
  faFilePen,
  faTriangleExclamation,
  faArrowsRotate,
  faPowerOff,
  faCircleXmark,
  faCircleCheck,
  faListOl,
  faEye,
  faGears,
  faSprayCan,
  faArrowsUpToLine,
  faTemperatureArrowUp,
  faTrashCan,
  faArrowUpFromBracket,
  faPlus,
  faList,
  faAnglesUp,
  faAngleUp,
  faEllipsisVertical,
  faTrashCanArrowUp,
  faCircle,
  faUpload,
  faSpinner,
  faScissors,
  faArrowDownShortWide,
  faSoap,
  faFloppyDisk,
  faUpDownLeftRight,
  faGear,
  faGamepad,
  faWrench,
  faServer,
  faRulerVertical,
  faWifi,
  faRotateRight,
  faPen,
  faArrowDownUpAcrossLine,
  faVirusSlash,
  faLocationCrosshairs,
  faXmarksLines,
  faWaveSquare,
  faTerminal,
  faTableCells,
} from '@fortawesome/free-solid-svg-icons'

// Add the "bars" icon to the library
library.add(
  faBars,
  faCircleExclamation,
  faGlobe,
  faAngleDown,
  faPlay,
  faPause,
  faStop,
  faFan,
  faClock,
  faHourglassStart,
  faLayerGroup,
  faBarsStaggered,
  faTape,
  faFile,
  faArrowsSpin,
  faHome,
  faLightbulb,
  faArrowsUpDownLeftRight,
  faCircleRadiation,
  faTemperatureThreeQuarters,
  faPlugCircleExclamation,
  faPlug,
  faChalkboard,
  faFilePen,
  faTriangleExclamation,
  faArrowsRotate,
  faPowerOff,
  faCircleXmark,
  faCircleCheck,
  faListOl,
  faEye,
  faGears,
  faEye,
  faSprayCan,
  faArrowsUpToLine,
  faTemperatureArrowUp,
  faTrashCan,
  faArrowUpFromBracket,
  faPlus,
  faList,
  faPlay,
  faAnglesUp,
  faAngleUp,
  faEllipsisVertical,
  faTrashCanArrowUp,
  faCircle,
  faUpload,
  faSpinner,
  faScissors,
  faArrowDownShortWide,
  faSoap,
  faFloppyDisk,
  faUpDownLeftRight,
  faGear,
  faGamepad,
  faWrench,
  faServer,
  faRulerVertical,
  faWifi,
  faRotateRight,
  faPen,
  faArrowDownUpAcrossLine,
  faVirusSlash,
  faLocationCrosshairs,
  faXmarksLines,
  faWaveSquare,
  faTerminal,
  faTableCells,
)

// Get hostname
app.component('font-awesome-icon', FontAwesomeIcon).mount('#app')
const is_production = import.meta.env.VITE_IS_PRODUCTION
const GeneralVariablesStore = useGeneralVariablesStore()
if (is_production === true) {
  GeneralVariablesStore.hostname = window.location.host
} else {
  GeneralVariablesStore.hostname = import.meta.env.VITE_HOSTNAME
}

// Initialize server
const websocketStore = useWebsocketStore()
websocketStore.connectWebSocket()
const DatabaseStore = useDatabaseStore()
DatabaseStore.initializeDatabase()
const MoonrakerStore = useMoonrakerStore()
MoonrakerStore.initMoonraker()
const PrinterStore = usePrinterStore()
PrinterStore.initPrinterLoad()
const JobQueueStore = useJobQueueStore()
JobQueueStore.getQueueJobs()
const PrintFilesStore = usePrintFilesStore()
PrintFilesStore.loadPrintFiles()
