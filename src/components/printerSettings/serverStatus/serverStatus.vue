<template>
  <div class="box_content_large mt_32">
    <div class="box_content_header">
      <div>
        <font-awesome-icon :icon="['fas', 'server']" class="mr_8" />
        Server Status
      </div>
    </div>

    <div class="box_content_info">
      <div>
        <p>
          <strong>OS:</strong> Debian GNU<br />
          <strong> Distro:</strong>
          armbian<br />
          <strong>Hostname:</strong> {{ GeneralVariablesStore.mcuStatus.hostname }}.local<br />
          <strong>WebSocket:</strong>
          {{ GeneralVariablesStore.systemStats.websocketConnections }}
        </p>
        <p>
          <strong class="font_underline">CPU</strong><br />
          <strong>Load:</strong>
          {{ GeneralVariablesStore.systemStats.cpuUsage.toFixed(2) }}% <br />
          <strong>Memory used:</strong>
          {{ formatMemory(GeneralVariablesStore.systemStats.memoryUsage.used) }} <br />
          <strong>Total Memory:</strong>
          {{ formatMemory(GeneralVariablesStore.systemStats.memoryUsage.total) }} <br />
          <strong>Temp:</strong>
          {{ GeneralVariablesStore.systemStats.cpuTemp.toFixed(2) }}°C
        </p>
      </div>
      <cpuCharts />
    </div>
  </div>
</template>

<script setup>
import { useGeneralVariablesStore } from '@/stores/useGeneralVariablesStore'
import cpuCharts from '@/components/printerSettings/serverStatus/cpuCharts.vue'

const GeneralVariablesStore = useGeneralVariablesStore()

// methods
function formatMemory(kb) {
  return (kb / 1024).toFixed(2) + ' MB'
}
</script>

<style scoped>
h3 {
  margin: 0;
  padding: 0;
  border-bottom: 1px solid var(--primary-font-color);
}

p {
  margin: 0px;
  margin-top: 8px;
}

.box_content_info {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
}
</style>
