<template>
  <div class="printing_status mt_20">
    <div class="printing_percentage">
      <v-chart :option="gaugeProgress" autoresize />
      <div class="font_green">
        {{ GeneralVariablesStore.printJobStatus.state.toUpperCase() }}
      </div>
    </div>
    <div class="print_buttons">
      <button
        class="btn button_green font_size_14"
        @click="JobQueueStore.resumePrint"
        :disabled="GeneralVariablesStore.printJobStatus.state !== 'paused'"
        :class="{ button_disabled: GeneralVariablesStore.printJobStatus.state !== 'paused' }"
      >
        <font-awesome-icon :icon="['fas', 'play']" />
      </button>
      <button
        class="btn button_primary font_size_14"
        @click="JobQueueStore.pausePrint"
        :disabled="GeneralVariablesStore.printJobStatus.state !== 'printing'"
        :class="{ button_disabled: GeneralVariablesStore.printJobStatus.state !== 'printing' }"
      >
        <font-awesome-icon :icon="['fas', 'pause']" />
      </button>
      <button
        class="btn button_red font_size_14s"
        @click="JobQueueStore.cancelPrint"
        :disabled="!['printing', 'paused'].includes(GeneralVariablesStore.printJobStatus.state)"
        :class="{
          button_disabled: !['printing', 'paused'].includes(
            GeneralVariablesStore.printJobStatus.state,
          ),
        }"
      >
        <font-awesome-icon :icon="['fas', 'stop']" />
      </button>
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
import { useJobQueueStore } from '@/stores/useJobQueueStore'

// Variables
const GeneralVariablesStore = useGeneralVariablesStore()
const JobQueueStore = useJobQueueStore()

// Chart
use([GaugeChart, CanvasRenderer])
const gaugeProgress = ref({
  series: [
    {
      type: 'gauge',
      startAngle: 90,
      endAngle: -270,
      radius: '65px', // Ensure the gauge is properly sized
      progress: {
        show: true,
        width: 15,
        itemStyle: {
          color: '#4a72ca', // Set the progress bar color
        },
      },
      axisLine: {
        lineStyle: {
          width: 15,
          color: [
            [1, '#ededed'], // Background color
          ],
        },
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      pointer: {
        show: false,
      },
      detail: {
        valueAnimation: true,
        fontSize: 22,
        fontWeight: 'bold',
        color: '#6486d1',
        formatter: '{value}%',
        offsetCenter: [0, 2],
      },
      data: [
        {
          value: (GeneralVariablesStore.printJobStatus.progress * 100).toFixed(0), // Current value
        },
      ],
    },
  ],
})

// Watchers
watch(
  () => GeneralVariablesStore.printJobStatus.progress,
  (newStats) => {
    // Update Progress
    gaugeProgress.value.series[0].data[0].value = (newStats * 100).toFixed(0)
  },
  { immediate: true, deep: true },
)
</script>

<style scope>
.printing_status {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.printing_status .printing_percentage {
  width: 50%;
  text-align: center;
  height: 150px;
}

.printing_status .print_buttons {
  justify-content: center;
  width: 40%;
}

.printing_status .print_buttons .btn {
  display: block;
  width: 100%;
  max-width: 200px;
  padding: 10px 20px;
  margin-top: 4px;
  color: var(--primary-font-color) !important;
}

.button_disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
