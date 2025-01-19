<template>
  <h3 class="mt_0 mb_24">Fans Control</h3>
  <div>
    <div class="fan_header">
      <div class="font_size_16_bold">
        <font-awesome-icon :icon="['fas', 'fan']" class="mr_8" />
        Layer Fan ({{ GeneralVariablesStore.fanStatus.layer_blower * 100 }}%)
      </div>
      <div>100%</div>
    </div>
    <input
      type="range"
      class="w_100 mt_12"
      min="0"
      max="1"
      step="0.1"
      @input="printerStore.setLayerFanSpeed(parseFloat($event.target.value))"
      :value="GeneralVariablesStore.fanStatus.layer_blower"
    />
  </div>

  <div>
    <div class="fan_header mt_20">
      <div class="font_size_16_bold">
        <font-awesome-icon :icon="['fas', 'fan']" class="mr_8" />
        Aux Fan ({{ GeneralVariablesStore.fanStatus.aux_blower * 100 }}%)
      </div>
      <div>100%</div>
    </div>
    <input
      type="range"
      class="w_100 mt_12"
      min="0"
      max="1"
      step="0.1"
      @input="printerStore.setAuxBlowerFanSpeed(parseFloat($event.target.value))"
      :value="GeneralVariablesStore.fanStatus.aux_blower"
    />
  </div>

  <div>
    <div class="fan_header mt_20">
      <div class="font_size_16_bold">
        <font-awesome-icon :icon="['fas', 'fan']" class="mr_8" />
        Hotend Fan ({{ GeneralVariablesStore.fanStatus.hotend_fan * 100 }}%)
      </div>
      <div>100%</div>
    </div>
    <input
      type="range"
      class="w_100 mt_12"
      min="0"
      max="1"
      step="0.1"
      :value="GeneralVariablesStore.fanStatus.aux_blower"
      disabled
    />
  </div>
</template>

<script setup>
import { useGeneralVariablesStore } from '@/stores/useGeneralVariablesStore'
import { usePrinterStore } from '@/stores/usePrinterStore'

// Variables
const GeneralVariablesStore = useGeneralVariablesStore()
const printerStore = usePrinterStore()
</script>

<style scoped>
.fan_buttons {
  flex: 1 1 300px;
}

.fan_buttons .fan_header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
