<template>
  <div>
    <div class="fan_header">
      <div class="font_size_16_bold">
        <font-awesome-icon :icon="['fas', 'bars-staggered']" class="mr_8" />
        Speed Factor ({{ GeneralVariablesStore.printJobStatus.speed_factor * 100 }}%)
      </div>
      <div>200%</div>
    </div>
    <input
      type="range"
      class="w_100 mt_12"
      min="0"
      max="2"
      step="0.1"
      :value="GeneralVariablesStore.printJobStatus.speed_factor"
    />
  </div>

  <div class="mt_20">
    <div class="fan_header">
      <div class="font_size_16_bold">
        <font-awesome-icon :icon="['fas', 'gears']" class="mr_8" />
        Flow Factor ({{ GeneralVariablesStore.printJobStatus.extruder_factor * 100 }}%)
      </div>
      <div>200%</div>
    </div>
    <div>
      <input
        type="range"
        class="w_100 mt_12"
        min="0"
        max="2"
        step="0.1"
        :value="GeneralVariablesStore.printJobStatus.extruder_factor"
      />
    </div>
  </div>
</template>

<script setup>
import { useGeneralVariablesStore } from '@/stores/useGeneralVariablesStore'

// Variables
const GeneralVariablesStore = useGeneralVariablesStore()
</script>

<style scope>
.fan_header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
