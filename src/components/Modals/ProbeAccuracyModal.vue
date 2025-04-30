<template>
  <div v-if="ModalStore.probeAccuracyModal" class="modal">
    <div class="modal_container">
      <div class="modal_header">
        <div class="font_size_18_bold">
          <font-awesome-icon :icon="['fas', 'ruler-vertical']" class="mr_8" />
          Probe Accuracy Results
        </div>
        <button
          class="btn font_size_16_bold"
          type="button"
          @click="ModalStore.closeProbeCalibration()"
        >
          X
        </button>
      </div>

      <div class="modal_content">
        <div v-if="ModalStore.probeResults">
          <div class="result_row">
            <span class="label">Mean:</span>
            <span class="value">{{ ModalStore.probeResults.mean.toFixed(3) }} mm</span>
          </div>
          <div class="result_row">
            <span class="label">Median:</span>
            <span class="value">{{ ModalStore.probeResults.median.toFixed(3) }} mm</span>
          </div>
          <div class="result_row">
            <span class="label">Standard Deviation:</span>
            <span class="value">{{ ModalStore.probeResults.stddev.toFixed(3) }} mm</span>
          </div>
          <div class="result_row">
            <span class="label">Range:</span>
            <span class="value">{{ ModalStore.probeResults.range.toFixed(3) }} mm</span>
          </div>
          <div class="result_row">
            <span class="label">Maximum:</span>
            <span class="value">{{ ModalStore.probeResults.max.toFixed(3) }} mm</span>
          </div>
          <div class="result_row">
            <span class="label">Minimum:</span>
            <span class="value">{{ ModalStore.probeResults.min.toFixed(3) }} mm</span>
          </div>
          <div class="result_row">
            <span class="label">Samples:</span>
            <span class="value">{{ ModalStore.probeResults.samples }}</span>
          </div>
        </div>
        <div v-else>Testing probe accuracy... Please wait.</div>
        <button class="btn button_primary mt_12" @click="ModalStore.closeProbeCalibration()">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useModalStore } from '@/stores/useModalStore'

// Variables
const ModalStore = useModalStore()
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
