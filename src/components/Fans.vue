<template>
  <div class="fans box">
    <h2>Fans</h2>
    <ul>
      <li v-for="(speed, fan) in fanSpeeds" :key="fan">
        {{ fan }}: {{ speed }}%
      </li>
    </ul>
  </div>
</template>

<script setup>
import { usePrinterStore } from '@/stores/usePrinter.js';

const { printerVariables } = usePrinterStore();
const { fanSpeeds } = printerVariables;
</script>

<style scoped>
.box {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
}
</style>
