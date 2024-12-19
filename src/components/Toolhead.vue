<template>
  <div class="toolhead box">
    <h2>Toolhead Position</h2>
    <p>Position: X={{ toolheadPosition.x }}, Y={{ toolheadPosition.y }}, Z={{ toolheadPosition.z }}</p>
    <p>Z Offset: {{ currentZOffset }}</p>
  </div>
</template>

<script setup>
import { usePrinterStore } from '@/stores/usePrinter.js';

const { printerVariables } = usePrinterStore();
const { toolheadPosition, currentZOffset } = printerVariables;
</script>

<style scoped>
.box {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
}
</style>
