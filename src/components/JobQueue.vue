<template>
  <div class="job-queue box">
    <h2>Job Queue</h2>
    <ul>
      <li v-for="(job, index) in printerStatus.jobQueue" :key="index">
        {{ job }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { usePrinterStore } from '@/stores/usePrinter.js';

const { printerStatus } = usePrinterStore();
</script>

<style scoped>
.box {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
}
</style>
