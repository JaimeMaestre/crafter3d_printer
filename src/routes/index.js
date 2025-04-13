import { createRouter, createWebHistory } from 'vue-router'

// Import your components for each menu
import printerDashboard from '@/views/printerDashboard.vue'
import printFiles from '@/views/printFiles.vue'
import printerSettings from '@/views/printerSettings.vue'
import editFile_infinite_z from '@/views/editFile_infinite_z.vue'
import editFile_standard from '@/views/editFile_standard.vue'
import editFile_printer from '@/views/editFile_printer.vue'

const routes = [
  { path: '/', name: 'printerDashboard', component: printerDashboard },
  { path: '/print-files', name: 'printFiles', component: printFiles },
  { path: '/settings', name: 'printerSettings', component: printerSettings },
  { path: '/edit-file-infinite-z', name: 'editFile_infinite-z', component: editFile_infinite_z },
  { path: '/edit-file-standard', name: 'editFile_standard', component: editFile_standard },
  { path: '/edit-file-printer', name: 'editFile_printer', component: editFile_printer },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
