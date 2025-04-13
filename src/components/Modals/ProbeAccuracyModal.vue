<template>
  <div v-if="GeneralVariablesStore.probeAccuracyModalVisible" class="modal">
    <div class="modal_container">
      <div class="modal_header">
        <div class="font_size_18_bold">
          <font-awesome-icon :icon="['fas', 'ruler-vertical']" class="mr_8" />
          Probe Accuracy Results
        </div>
        <button
          class="btn font_size_16_bold"
          type="button"
          @click="GeneralVariablesStore.probeAccuracyModalVisible = false"
        >
          X
        </button>
      </div>

      <div class="modal_content">
        <div v-if="GeneralVariablesStore.probeResults">
          <div class="result_row">
            <span class="label">Mean:</span>
            <span class="value">{{ GeneralVariablesStore.probeResults.mean.toFixed(3) }} mm</span>
          </div>
          <div class="result_row">
            <span class="label">Median:</span>
            <span class="value">{{ GeneralVariablesStore.probeResults.median.toFixed(3) }} mm</span>
          </div>
          <div class="result_row">
            <span class="label">Standard Deviation:</span>
            <span class="value">{{ GeneralVariablesStore.probeResults.stddev.toFixed(3) }} mm</span>
          </div>
          <div class="result_row">
            <span class="label">Range:</span>
            <span class="value">{{ GeneralVariablesStore.probeResults.range.toFixed(3) }} mm</span>
          </div>
          <div class="result_row">
            <span class="label">Maximum:</span>
            <span class="value">{{ GeneralVariablesStore.probeResults.max.toFixed(3) }} mm</span>
          </div>
          <div class="result_row">
            <span class="label">Minimum:</span>
            <span class="value">{{ GeneralVariablesStore.probeResults.min.toFixed(3) }} mm</span>
          </div>
          <div class="result_row">
            <span class="label">Samples:</span>
            <span class="value">{{ GeneralVariablesStore.probeResults.samples }}</span>
          </div>
        </div>
        <div v-else>Testing probe accuracy... Please wait.</div>
        <button
          class="btn button_primary mt_12"
          @click="GeneralVariablesStore.probeAccuracyModalVisible = false"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGeneralVariablesStore } from '@/stores/useGeneralVariablesStore'

// Variables
const GeneralVariablesStore = useGeneralVariablesStore()
</script>

<style scoped>
.result_row {
  display: flex;
  justify-content: space-between;
  margin: 8px 0;
  padding: 4px 0;
  border-bottom: 1px solid var(--primary-color-8);
}

.label {
  font-weight: bold;
  margin-right: 16px;
}

.value {
  font-family: monospace;
}
</style>
