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
import { ref, onMounted, watch, nextTick } from 'vue'
import { useGeneralVariablesStore } from '@/stores/useGeneralVariablesStore'
import Plotly from 'plotly.js-dist'

const GeneralVariablesStore = useGeneralVariablesStore()
const hasMeshData = ref(false)

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
    // The bed mesh data is already in the correct format for Plotly
    const data = bedMesh

    const layout = {
      title: 'Bed Mesh Visualization',
      scene: {
        xaxis: {
          title: 'X Position',
          gridcolor: '#444',
          zerolinecolor: '#666',
          color: '#fff',
        },
        yaxis: {
          title: 'Y Position',
          gridcolor: '#444',
          zerolinecolor: '#666',
          color: '#fff',
        },
        zaxis: {
          title: 'Height (mm)',
          gridcolor: '#444',
          zerolinecolor: '#666',
          color: '#fff',
          range: [-1, 1],
        },
        bgcolor: '#1a1a1a',
        camera: {
          eye: { x: 1.5, y: 1.5, z: 0.5 },
          center: { x: 0, y: 0, z: 0 },
        },
      },
      paper_bgcolor: '#1a1a1a',
      plot_bgcolor: '#1a1a1a',
      font: {
        color: '#fff',
      },
      margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 40,
        pad: 0,
      },
      autosize: true,
      width: null,
      height: null,
    }

    const config = {
      responsive: true,
      displayModeBar: true,
      displaylogo: false,
      useResizeHandler: true,
    }

    Plotly.newPlot('bedMeshPlot', data, layout, config)
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
