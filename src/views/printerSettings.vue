<template>
  <div class="printerSettings mb_40">
    <div>
      <motionSettings />
      <heatProfiles />
      <othersSettings />
    </div>
    <div class="printerSettings_mobile">
      <calibrationButtons />
      <bedMesh />
      <gcodeConsole />
      <serverStatus />
      <printerStatus />
      <wifiSettings />
    </div>
  </div>
</template>

<script setup>
import calibrationButtons from '@/components/printerSettings/calibration/calibrationButtons.vue'
import heatProfiles from '@/components/printerSettings/printerSettings/heatProfiles.vue'
import motionSettings from '@/components/printerSettings/printerSettings/motionSettings.vue'
import serverStatus from '@/components/printerSettings/serverStatus/serverStatus.vue'
import printerStatus from '@/components/printerSettings/printerStatus/printerStatus.vue'
import wifiSettings from '@/components/printerSettings/wifiSettings/wifiSettings.vue'
import othersSettings from '@/components/printerSettings/printerSettings/othersSettings.vue'
import gcodeConsole from '@/components/printerSettings/console/GcodeConsole.vue'
import bedMesh from '@/components/printerSettings/bedMesh/bedMesh.vue'
</script>

<style scoped>
.printerSettings {
  display: flex;
  justify-content: space-between;
  gap: 32px;
}

.printerSettings div {
  flex: 1 1 auto;
}

@media (max-width: 870px) {
  .printerSettings {
    display: block;
  }

  .printerSettings_mobile {
    margin-top: 32px;
  }
}
</style>
