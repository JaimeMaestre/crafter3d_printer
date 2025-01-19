<template>
  <div class="dashboard mb_40">
    <div class="dashboard_content">
      <printingStatus />
      <recentFiles />
    </div>
    <div class="dashboard_content dashboard_content_mobile">
      <printerControl />
      <printerTemperature />
    </div>
  </div>
</template>

<script setup>
import printingStatus from '@/components/printerDashboard/printingStatus.vue'
import printerControl from '@/components/printerDashboard/printerControl.vue'
import printerTemperature from '@/components/printerDashboard/printerTemperature.vue'
import recentFiles from '@/components/printerDashboard/recentFiles.vue'
</script>

<style scoped>
.dashboard {
  display: flex;
  justify-content: space-between;
  gap: 32px;
}

.dashboard_content {
  flex: 1 1 auto;
}

@media (max-width: 870px) {
  .dashboard {
    display: block;
  }

  .dashboard_content_mobile {
    margin-top: 40px;
  }
}
</style>
