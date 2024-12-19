<template>
  <div class="printer-status box">
    <h2>Printer Status</h2>
    <ul>
      <li>Status: {{ printerStatus.status }}</li>
      <li>Print Speed Factor: {{ printerStatus.speedFactor }}</li>
      <li>Print Flow: {{ printerStatus.flow }}</li>
      <li>Printed Filament: {{ printerStatus.filamentUsed }}</li>
      <li>Printed Layer: {{ printerStatus.layer }}</li>
      <li>Estimated Print Time: {{ printerStatus.estimatedPrintTime }}</li>
      <li>Total Print Time: {{ printerStatus.totalPrintTime }}</li>
      <li>Bed temperature: {{ printerVariables.bed_temp }}</li>
      <li>Extruder temperature: {{ printerVariables.extruder_temp }}</li>
    </ul>
  </div>
</template>

<script setup>
import { usePrinterStore } from '@/stores/usePrinter.js';

const { printerStatus, printerVariables } = usePrinterStore();
</script>

<style scoped>
.box {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
}
</style>
