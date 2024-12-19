<template>
  <div class="temperature-graph box">
    <h2>Temperature Graph</h2>
    <PlotlyGraph :data="plotData" :layout="layout" />
  </div>
</template>

<script setup>
import { usePrinterStore } from '@/stores/usePrinter.js';
import PlotlyGraph from '@/components/PlotlyGraph.vue';

const { printerVariables } = usePrinterStore();

// Prepare temperature data for the graph
const plotData = [
  {
    x: Array.from({ length: printerVariables.historicalTemperatures.length }, (_, i) => i),
    y: printerVariables.historicalTemperatures.map((temp) => temp.temperature),
    type: 'scatter',
    mode: 'lines',
    name: 'Temperature',
  },
];

const layout = {
  title: 'Temperature Over Time',
  xaxis: { title: 'Time (s)' },
  yaxis: { title: 'Temperature (°C)' },
};
</script>

<style scoped>
.box {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
}
</style>
