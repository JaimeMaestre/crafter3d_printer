<template>
  <v-chart :option="chartOptions" class="chart" autoresize />
</template>

<script setup>
import { use } from 'echarts/core'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import { ref, watch } from 'vue'
import { useGeneralVariablesStore } from '@/stores/useGeneralVariablesStore'

//variables
const GeneralVariablesStore = useGeneralVariablesStore()
const max_temp = ref(40)

use([TitleComponent, TooltipComponent, LegendComponent, GridComponent, LineChart, CanvasRenderer])

const chartOptions = ref({
  title: {
    text: 'Historical Temperatures',
  },
  tooltip: {
    trigger: 'axis',
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [],
    splitLine: {
      show: true,
      lineStyle: {
        color: '#3f3d3d',
        type: 'solid',
      },
    },
  },
  yAxis: {
    type: 'value',
    min: 0,
    max: max_temp,
    minInterval: 20,
    maxInterval: 100,
    nameGap: 5,
    axisLabel: {
      formatter: '{value}°C',
      margin: 10,
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: '#3f3d3d',
        type: 'solid',
      },
    },
  },
  series: [
    {
      name: 'Hotend Temperature',
      data: [],
      type: 'line',
      areaStyle: {},
      itemStyle: {
        color: '#ffa033',
      },
      emphasis: {
        focus: 'series',
      },
    },
    {
      name: 'Bed Temperature',
      data: [],
      type: 'line',
      itemStyle: {
        color: '#a7d4ac',
      },
      areaStyle: {},
      emphasis: {
        focus: 'series',
      },
    },
    {
      name: 'Electronics',
      data: [],
      type: 'line',
      itemStyle: {
        color: '#3f64ad',
      },
      areaStyle: {},
      emphasis: {
        focus: 'series',
      },
    },
  ],
})

// Getter
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

// Watcher
const historyDataInserted = ref(false)
const timeData = ref([])
const interval = 1000
watch(
  () => GeneralVariablesStore.temperatureStatus,
  (temperatureStatus) => {
    if (temperatureStatus.hotend_historic_temp?.length > 0 && historyDataInserted.value === false) {
      timeData.value = Array.from(
        { length: temperatureStatus.hotend_historic_temp.length },
        (_, i) => Date.now() - (temperatureStatus.hotend_historic_temp.length - i - 1) * interval,
      )
      chartOptions.value.xAxis.data = timeData.value.map(formatTime)
      chartOptions.value.series[0].data = [...temperatureStatus.hotend_historic_temp]
      chartOptions.value.series[1].data = [...temperatureStatus.bed_historic_temp]
      chartOptions.value.series[2].data = [...temperatureStatus.electronics_historic_temp]

      let maxHotendTemp = Math.max(...(chartOptions.value.series[0].data || [0]))
      let maxBedTemp = Math.max(...(chartOptions.value.series[1].data || [0]))
      let maxElectronicsTemp = Math.max(...(chartOptions.value.series[2].data || [0]))
      max_temp.value = Math.round(Math.max(maxHotendTemp, maxBedTemp, maxElectronicsTemp) + 30)
      historyDataInserted.value = true
    } else {
      if (Date.now() - timeData.value[timeData.value.length - 1] > interval) {
        timeData.value.push(Date.now())

        chartOptions.value.series[0].data.push(temperatureStatus.hotend_current_temp)
        chartOptions.value.series[1].data.push(temperatureStatus.bed_current_temp)
        chartOptions.value.series[2].data.push(temperatureStatus.electronics_temp)

        // Ensure the data length is limited to the latest 300 points
        if (timeData.value.length > temperatureStatus.maximum_history_values) {
          timeData.value.shift()
          chartOptions.value.series[0].data.shift()
          chartOptions.value.series[1].data.shift()
          chartOptions.value.series[2].data.shift()
        }

        let maxHotendTemp = Math.max(...(chartOptions.value.series[0].data || [0]))
        let maxBedTemp = Math.max(...(chartOptions.value.series[1].data || [0]))
        let maxElectronicsTemp = Math.max(...(chartOptions.value.series[2].data || [0]))
        max_temp.value = Math.round(Math.max(maxHotendTemp, maxBedTemp, maxElectronicsTemp) + 30)

        chartOptions.value.xAxis.data = timeData.value.map(formatTime)
      }
    }
  },
  { deep: true, immediate: true },
)
</script>

<style scoped>
.chart {
  height: 400px;
}

.color {
  color: #3f3d3d;
}
</style>
