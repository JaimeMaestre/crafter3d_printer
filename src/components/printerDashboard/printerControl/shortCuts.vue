<template>
  <h3 class="mt_0 mb_20">Shortcuts</h3>
  <div class="shortcut_buttons">
    <button
      :class="{
        'btn button_primary': GeneralVariablesStore.controlStatus.homed_axes.includes('xyz'),
        'btn button_primary_empty': !GeneralVariablesStore.controlStatus.homed_axes.includes('xyz'),
      }"
      @click="printerStore.setHomeFull()"
    >
      <div class="font_size_18"><font-awesome-icon :icon="['fas', 'house']" /></div>
      Homming
    </button>
    <button
      :class="{
        'btn button_primary': GeneralVariablesStore.controlStatus.led,
        'btn button_primary_empty': !GeneralVariablesStore.controlStatus.led,
      }"
      @click="printerStore.setLED()"
    >
      <div class="font_size_18"><font-awesome-icon :icon="['fas', 'lightbulb']" /></div>
      Light
    </button>
    <button class="btn button_primary_empty">
      <div class="font_size_18"><font-awesome-icon :icon="['fas', 'circle-radiation']" /></div>
      Belt Throw
    </button>
    <button class="btn button_primary_empty">
      <div class="font_size_18"><font-awesome-icon :icon="['fas', 'scissors']" /></div>
      Filament Cut
    </button>
    <button class="btn button_primary_empty">
      <div class="font_size_18"><font-awesome-icon :icon="['fas', 'soap']" /></div>
      Purge & Clean
    </button>
    <button class="btn button_primary_empty">
      <div class="font_size_18"><font-awesome-icon :icon="['fas', 'arrow-down-short-wide']" /></div>
      Lower Z Axis
    </button>
  </div>
</template>

<script setup>
import { useGeneralVariablesStore } from '@/stores/useGeneralVariablesStore'
import { usePrinterStore } from '@/stores/usePrinterStore'

// Variables
const GeneralVariablesStore = useGeneralVariablesStore()
const printerStore = usePrinterStore()
</script>

<style scope>
.shortcut_buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.shortcut_buttons .btn {
  width: 100px;
  white-space: wrap;
}
</style>
