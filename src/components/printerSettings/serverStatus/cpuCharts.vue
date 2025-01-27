<template>
  <div class="percentages_charts">
    <div class="chart_wrapper">
      <v-chart :option="gaugeMemory" autoresize />
      Memory
    </div>
    <div class="chart_wrapper">
      <v-chart :option="gaugeCPU" autoresize />
      CPU
    </div>
    <div class="chart_wrapper">
      <v-chart :option="gaugeTemp" autoresize />
      CPU Temp
    </div>
  </div>
</template>

<script setup>
import { use } from 'echarts/core'
import { GaugeChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import { ref, watch } from 'vue'
import { useGeneralVariablesStore } from '@/stores/useGeneralVariablesStore'

// Variables
use([GaugeChart, CanvasRenderer])
const GeneralVariablesStore = useGeneralVariablesStore()

// Chart function
function createGaugeConfig(label, color, unit) {
  return {
    series: [
      {
        type: 'gauge',
        startAngle: 90,
        endAngle: -270,
        radius: '40', // Adjust the gauge size
        progress: {
          show: true,
          width: 10,
          itemStyle: {
            color: color,
          },
        },
        axisLine: {
          lineStyle: {
            width: 10,
            color: [[1, '#ededed']],
          },
        },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        pointer: { show: false },
        detail: {
          valueAnimation: true,
          fontSize: 14,
          fontWeight: 'bold',
          color: color,
          formatter: `{value}${unit}`,
          offsetCenter: [0, 2], // Adjust position of the label
        },
        data: [{ value: 0 }],
      },
    ],
  }
}

// Initialize chart configurations
const gaugeCPU = ref(createGaugeConfig('CPU Usage', '#4a72ca', '%'))
const gaugeMemory = ref(createGaugeConfig('Memory Usage', '#4a72ca', '%'))
const gaugeTemp = ref(createGaugeConfig('CPU Temp', '#4a72ca', 'ºC'))

// Watchers
watch(
  () => GeneralVariablesStore.systemStats,
  (newStats) => {
    // Update CPU Usage
    gaugeCPU.value.series[0].data[0].value = newStats.cpuUsage.toFixed(2)

    // Update Memory Usage
    const memoryUsage = (newStats.memoryUsage.used / newStats.memoryUsage.total) * 100 || 0
    gaugeMemory.value.series[0].data[0].value = memoryUsage.toFixed(2)

    // Update CPU Temperature
    gaugeTemp.value.series[0].data[0].value = newStats.cpuTemp.toFixed(2)
  },
  { immediate: true, deep: true },
)
</script>

<style scoped>
.percentages_charts {
  display: flex;
}

.chart_wrapper {
  width: 100px;
  height: 90px;
  margin-bottom: 30px;
  text-align: center;
}
</style>
