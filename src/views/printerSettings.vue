<template>
  <div class="printerSettings mb_40">
    <div>
      <startUp />
      <motionSettings />
      <heatProfiles />
      <othersSettings />
    </div>
    <div class="printerSettings_mobile">
      <calibrationButtons />
      <serverStatus />
    </div>
  </div>
</template>

<script setup>
import calibrationButtons from '@/components/printerSettings/calibrationButtons.vue'
import heatProfiles from '@/components/printerSettings/heatProfiles.vue'
import motionSettings from '@/components/printerSettings/motionSettings.vue'
import serverStatus from '@/components/printerSettings/serverStatus.vue'
import startUp from '@/components/printerSettings/startUp.vue'
import othersSettings from '@/components/printerSettings/othersSettings.vue'
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
