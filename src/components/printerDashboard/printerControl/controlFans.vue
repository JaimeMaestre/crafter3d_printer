<template>
  <div>
    <!-- Layer Fan -->
    <div class="fan_header">
      <div class="font_size_16_bold">
        <font-awesome-icon :icon="['fas', 'fan']" class="mr_8" />
        Layer Fan ({{ (GeneralVariablesStore.fanStatus.layer_blower * 100).toFixed(0) }}%)
      </div>
      <div>100%</div>
    </div>
    <input
      type="range"
      class="fan_input w_100 mt_12"
      min="0"
      max="255"
      step="1"
      @input="gCodeStore.setLayerFanSpeed($event.target.value)"
      :value="GeneralVariablesStore.fanStatus.layer_blower * 255"
    />

    <!-- Aux Fan -->
    <div class="fan_header mt_20">
      <div class="font_size_16_bold">
        <font-awesome-icon :icon="['fas', 'fan']" class="mr_8" />
        Aux Fan ({{ (GeneralVariablesStore.fanStatus.aux_blower * 100).toFixed(0) }}%)
      </div>
      <div>100%</div>
    </div>
    <input
      type="range"
      class="fan_input w_100 mt_12"
      min="0"
      max="255"
      step="0.1"
      @input="gCodeStore.setAuxBlowerFanSpeed(parseFloat($event.target.value))"
      :value="GeneralVariablesStore.fanStatus.aux_blower * 255"
    />

    <!-- Hotend Fan -->
    <div class="fan_header mt_20">
      <div class="font_size_16_bold">
        <font-awesome-icon :icon="['fas', 'fan']" class="mr_8" />
        Hotend Fan ({{ GeneralVariablesStore.fanStatus.hotend_fan * 100 }}%)
      </div>
      <div>100%</div>
    </div>
    <input
      type="range"
      class="fan_input w_100 mt_12"
      min="0"
      max="1"
      step="0.1"
      :value="GeneralVariablesStore.fanStatus.hotend_fan"
      disabled
    />
  </div>
</template>

<script setup>
import { useGcodeStore } from '@/stores/useGcodeStore'
import { useGeneralVariablesStore } from '@/stores/useGeneralVariablesStore'

const gCodeStore = useGcodeStore()
const GeneralVariablesStore = useGeneralVariablesStore()
</script>

<style scoped></style>
