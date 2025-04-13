<template>
  <div class="row_info mt_12">
    <div class="text_center">
      <div class="font_size_16_bold">
        <font-awesome-icon :icon="['fas', 'clock']" class="mr_8" /> Time
      </div>
      <div class="mt_8">
        {{ GeneralVariablesStore.formatTime(GeneralVariablesStore.printJobStatus.total_duration) }}
      </div>
    </div>
    <div class="text_center">
      <div class="font_size_16_bold">
        <font-awesome-icon :icon="['fas', 'hourglass-start']" class="mr_8" /> ETA
      </div>
      <div class="mt_8">
        {{ GeneralVariablesStore.formatTime(GeneralVariablesStore.printJobStatus.time_left) }}
      </div>
    </div>
    <div class="text_center">
      <div class="font_size_16_bold">
        <font-awesome-icon :icon="['fas', 'layer-group']" class="mr_8" /> Layer
      </div>
      <div class="mt_8">
        {{ GeneralVariablesStore.printJobStatus.current_layer }}/{{
          GeneralVariablesStore.printJobStatus.total_layer
        }}
      </div>
    </div>
  </div>

  <div class="row_info">
    <div class="text_center">
      <div class="font_size_16_bold">
        <font-awesome-icon :icon="['fas', 'bars-staggered']" class="mr_8" /> Speed
      </div>
      <div class="mt_8">
        {{ GeneralVariablesStore.controlStatus.live_velocity.toFixed(1) }} mm/s
      </div>
    </div>
    <div class="text_center">
      <div class="font_size_16_bold">
        <font-awesome-icon :icon="['fas', 'arrows-spin']" class="mr_8" /> Flow
      </div>
      <div class="mt_8">
        {{ GeneralVariablesStore.controlStatus.flow_rate.toFixed(1) }} mm<sup>3</sup>/s
      </div>
    </div>
    <div class="text_center">
      <div class="font_size_16_bold">
        <font-awesome-icon :icon="['fas', 'tape']" class="mr_8" />Filament
      </div>
      <div class="mt_8">
        {{
          GeneralVariablesStore.printJobStatus.filament_used_mm / 1000 < 1
            ? GeneralVariablesStore.printJobStatus.filament_used_mm.toFixed(1)
            : (GeneralVariablesStore.printJobStatus.filament_used_mm / 1000).toFixed(1)
        }}
        {{ GeneralVariablesStore.printJobStatus.filament_used_mm / 1000 < 0 ? 'mm' : 'm' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGeneralVariablesStore } from '@/stores/useGeneralVariablesStore'

// Variables
const GeneralVariablesStore = useGeneralVariablesStore()

// Helpers
</script>

<style scope>
.row_info {
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-bottom: 1px solid var(--primary-font-color);
  padding: 10px 0px;
}
</style>
