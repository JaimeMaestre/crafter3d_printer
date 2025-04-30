<template>
  <div class="box_content_large mt_32">
    <div class="box_content_header">
      <div>
        <font-awesome-icon :icon="['fas', 'ruler-vertical']" class="mr_8" />
        Bed Mesh Visualization
      </div>
    </div>
    <div v-if="hasMeshData" id="bedMeshPlot" class="plot-container"></div>
    <div v-else class="no-data">No bed mesh data available</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, onUnmounted } from 'vue'
import { useGeneralVariablesStore } from '@/stores/useGeneralVariablesStore'
import * as echarts from 'echarts'
import 'echarts-gl'

const GeneralVariablesStore = useGeneralVariablesStore()
const hasMeshData = ref(false)
let chart = null

async function updatePlot() {
  const bedMesh = GeneralVariablesStore.controlStatus.bed_mesh

  if (!bedMesh || bedMesh.length === 0) {
    hasMeshData.value = false
    return
  }

  hasMeshData.value = true

  // Wait for the DOM to update
  await nextTick()

  try {
    if (!chart) {
      chart = echarts.init(document.getElementById('bedMeshPlot'))
    }

    // Get the first bed mesh object which contains the mesh data
    const meshData = bedMesh[0]
    const z = meshData.z
    const x = meshData.x
    const y = meshData.y

    // Convert the data to the format ECharts expects
    const data = []
    for (let i = 0; i < y.length; i++) {
      for (let j = 0; j < x.length; j++) {
        data.push([x[j], y[i], z[i][j]])
      }
    }

    const option = {
      backgroundColor: '#1a1a1a',
      tooltip: {
        formatter: function (params) {
          return `X: ${params.data[0].toFixed(2)}<br/>Y: ${params.data[1].toFixed(2)}<br/>Z: ${params.data[2].toFixed(3)}mm`
        },
      },
      visualMap: {
        show: true,
        dimension: 2,
        min: -1,
        max: 1,
        inRange: {
          color: [
            '#313695',
            '#4575b4',
            '#74add1',
            '#abd9e9',
            '#e0f3f8',
            '#ffffbf',
            '#fee090',
            '#fdae61',
            '#f46d43',
            '#d73027',
            '#a50026',
          ],
        },
        textStyle: {
          color: '#fff',
        },
      },
      xAxis3D: {
        type: 'value',
        name: 'X Position',
        nameTextStyle: { color: '#fff' },
        axisLine: { lineStyle: { color: '#666' } },
        axisLabel: { color: '#fff' },
      },
      yAxis3D: {
        type: 'value',
        name: 'Y Position',
        nameTextStyle: { color: '#fff' },
        axisLine: { lineStyle: { color: '#666' } },
        axisLabel: { color: '#fff' },
      },
      zAxis3D: {
        type: 'value',
        name: 'Height (mm)',
        nameTextStyle: { color: '#fff' },
        axisLine: { lineStyle: { color: '#666' } },
        axisLabel: { color: '#fff' },
        min: -1,
        max: 1,
      },
      grid3D: {
        boxWidth: 200,
        boxHeight: 200,
        boxDepth: 200,
        viewControl: {
          // Initial camera position
          alpha: 45,
          beta: 30,
          distance: 300,
        },
        light: {
          main: {
            intensity: 1.2,
          },
          ambient: {
            intensity: 0.3,
          },
        },
      },
      series: [
        {
          type: 'surface',
          data: data,
          shading: 'color',
          itemStyle: {
            opacity: 0.8,
          },
          emphasis: {
            itemStyle: {
              opacity: 1,
            },
          },
          wireframe: {
            show: true,
            lineStyle: {
              color: '#666',
              width: 1,
            },
          },
        },
      ],
    }

    chart.setOption(option)
  } catch (error) {
    console.error('Error plotting bed mesh:', error)
    hasMeshData.value = false
  }
}

// Watch for changes in bed mesh data
watch(
  () => GeneralVariablesStore.controlStatus.bed_mesh,
  () => {
    updatePlot()
  },
  { deep: true },
)

onMounted(() => {
  updatePlot()
  window.addEventListener('resize', () => {
    chart?.resize()
  })
})

onUnmounted(() => {
  chart?.dispose()
  window.removeEventListener('resize', () => {
    chart?.resize()
  })
})
</script>

<style scoped>
.plot-container {
  width: 100%;
  height: 400px;
  margin-top: 16px;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: var(--text-secondary);
}

h3 {
  margin: 0;
  color: var(--text-primary);
}
</style>
