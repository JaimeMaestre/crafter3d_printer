import { createRouter, createWebHistory } from 'vue-router'

// Import your components for each menu
import printerDashboard from '@/views/printerDashboard.vue'
import printFiles from '@/views/printFiles.vue'
import printerSettings from '@/views/printerSettings.vue'
import editFile_45 from '@/views/editFile_45.vue'
import editFile_standard from '@/views/editFile_standard.vue'

const routes = [
  { path: '/', name: 'printerDashboard', component: printerDashboard },
  { path: '/print-files', name: 'printFiles', component: printFiles },
  { path: '/settings', name: 'printerSettings', component: printerSettings },
  { path: '/edit-file-45', name: 'editFile_45', component: editFile_45 },
  { path: '/edit-file-standard', name: 'editFile_standard', component: editFile_standard },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
