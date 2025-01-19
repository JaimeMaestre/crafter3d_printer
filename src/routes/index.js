import { createRouter, createWebHistory } from 'vue-router'

// Import your components for each menu
import printerDashboard from '@/views/printerDashboard.vue'
import printFiles from '@/views/printFiles.vue'
import printerSettings from '@/views/printerSettings.vue'

const routes = [
  { path: '/', name: 'printerDashboard', component: printerDashboard },
  { path: '/print-files', name: 'printFiles', component: printFiles },
  { path: '/settings', name: 'printerSettings', component: printerSettings },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
