<template>
  <div v-if="printerStatus.status === 'printing'" class="printed-file box">
    <h2>Current Printed File</h2>
    <p>File Name: {{ printerStatus.printingFile }}</p>
    <GcodeViewer />
  </div>
</template>

<script setup>
import { usePrinterStore } from '@/stores/usePrinter.js';
import GcodeViewer from '@/components/GcodeViewer.vue';

const { printerStatus } = usePrinterStore();
</script>

<style scoped>
.box {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
}
</style>
