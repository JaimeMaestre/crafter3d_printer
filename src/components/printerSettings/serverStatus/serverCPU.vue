<template>
  <h3>Server CPU</h3>
  <div class="space_between">
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
      <p>
        <strong class="font_underline">Wifi</strong><br />
        <strong>Bandwidth:</strong>
        {{ GeneralVariablesStore.systemStats.network.wlan0.bandwidth.toFixed(1) }} kB/s<br />
        <strong>Received:</strong>
        {{ GeneralVariablesStore.systemStats.network.wlan0.received.toFixed(2) }} MB<br />
        <strong>Transmitted:</strong>
        {{ GeneralVariablesStore.systemStats.network.wlan0.transmitted.toFixed(2) }} MB<br />
      </p>
      <p>
        <strong class="font_underline">MCU</strong><br />
        <strong>MCU State:</strong>
        {{ GeneralVariablesStore.mcuStatus.mcu_state }}<br />
        <strong>Printer Status:</strong>
        {{ GeneralVariablesStore.mcuStatus.status }}<br />
        <strong>software:</strong>
        {{ GeneralVariablesStore.mcuStatus.software }}<br />
        <strong>Warnnings:</strong>
        {{ GeneralVariablesStore.mcuStatus.warnnings }}<br />
      </p>
      <button class="btn button_primary mt_12 mb_12" @click="ServerInfoStore.resetFirmware()">
        <font-awesome-icon :icon="['fas', 'power-off']" class="mr_8" /> Reset Firmware
      </button>
    </div>
    <cpuCharts />
  </div>
  <div>
    <p>
      <strong class="font_underline">List of USB</strong><br />
      <span v-for="(device, index) in GeneralVariablesStore.listUSB" :key="index">
        <strong>USB {{ device.device_id }}</strong>
        <ul>
          <li>Product: {{ device.product }}</li>
          <li>Manufacturer: {{ device.manufacturer }}</li>
          <li>Serial id: {{ device.serial }}</li>
          <li>Description: {{ device.description }}</li>
        </ul>
      </span>
    </p>
  </div>
</template>

<script setup>
import { useGeneralVariablesStore } from '@/stores/useGeneralVariablesStore'
import cpuCharts from '@/components/printerSettings/serverStatus/cpuCharts.vue'

const GeneralVariablesStore = useGeneralVariablesStore()

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

.space_between {
  display: flex;
  gap: 30%;
}

@media (max-width: 800px) {
  .space_between {
    gap: 5%;
  }
}
</style>
