<template>
  <div class="dashboard">
    <h1>Printer Dashboard</h1>
    <div class="grid-container">
      <PrinterStatus />
      <!-- <PrintedFile />
      <JobQueue />
      <RecentPrintJobs />
      <TemperatureGraph />
      <Toolhead />
      <Fans /> -->
    </div>
  </div>
</template>

<script setup>
import { usePrinterStore } from '@/stores/usePrinter.js';
import { onMounted } from 'vue';

import PrinterStatus from '@/components/PrinterStatus.vue';
// import PrintedFile from '@/components/PrintedFile.vue';
// import JobQueue from '@/components/JobQueue.vue';
// import RecentPrintJobs from '@/components/RecentPrintJobs.vue';
// import TemperatureGraph from '@/components/TemperatureGraph.vue';
// import Toolhead from '@/components/Toolhead.vue';
// import Fans from '@/components/Fans.vue';

const printerStore = usePrinterStore();

onMounted(() => {
  printerStore.subscribeToPrinterInfo();
});
</script>

<style>
.dashboard {
  padding: 20px;
}
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}
</style>
