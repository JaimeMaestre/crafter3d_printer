<template>
  <div ref="plotlyContainer" class="plotly-container"></div>
</template>

<script setup>
import Plotly from 'plotly.js';
import { ref, watch, onMounted, onUnmounted } from 'vue';

// Props for Plotly data and layout
defineProps({
  data: {
    type: Array,
    required: true,
  },
  layout: {
    type: Object,
    required: true,
  },
  config: {
    type: Object,
    default: () => ({}), // Optional Plotly config
  },
});

const plotlyContainer = ref(null);

function renderPlot() {
  if (plotlyContainer.value) {
    Plotly.react(plotlyContainer.value, data, layout, config);
  }
}

onMounted(() => {
  renderPlot();
});

watch([data, layout], renderPlot, { deep: true });

onUnmounted(() => {
  if (plotlyContainer.value) {
    Plotly.purge(plotlyContainer.value);
  }
});
</script>

<style scoped>
.plotly-container {
  width: 100%;
  height: 400px;
}
</style>
