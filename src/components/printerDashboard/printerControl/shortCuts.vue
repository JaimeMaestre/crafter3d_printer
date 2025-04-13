<template>
  <h3 class="mt_0 mb_20">Shortcuts</h3>
  <div class="shortcut_buttons">
    <button class="btn button_primary_empty" @click="gCodeStore.setHomeFull()">
      <div class="font_size_18">
        <font-awesome-icon :icon="['fas', 'house']" />
      </div>
      Home
    </button>
    <button
      :class="{
        'btn button_primary': GeneralVariablesStore.controlStatus.led,
        'btn button_primary_empty': !GeneralVariablesStore.controlStatus.led,
      }"
      @click="gCodeStore.setLED()"
    >
      <div class="font_size_18"><font-awesome-icon :icon="['fas', 'lightbulb']" /></div>
      Light
    </button>
    <button class="btn button_primary_empty" @click="gCodeStore.beltThrow()">
      <div class="font_size_18"><font-awesome-icon :icon="['fas', 'circle-radiation']" /></div>
      Belt Throw
    </button>
    <button class="btn button_primary_empty" @click="gCodeStore.cutFilament()">
      <div class="font_size_18"><font-awesome-icon :icon="['fas', 'scissors']" /></div>
      Filament Cut
    </button>
    <button class="btn button_primary_empty">
      <div class="font_size_18"><font-awesome-icon :icon="['fas', 'soap']" /></div>
      Purge & Clean
    </button>
    <button class="btn button_primary_empty" @click="gCodeStore.minZposition()">
      <div class="font_size_18"><font-awesome-icon :icon="['fas', 'arrow-down-short-wide']" /></div>
      Lower Z Axis
    </button>
  </div>
</template>

<script setup>
import { useGeneralVariablesStore } from '@/stores/useGeneralVariablesStore'
import { useGcodeStore } from '@/stores/useGcodeStore'

// Variables
const GeneralVariablesStore = useGeneralVariablesStore()
const gCodeStore = useGcodeStore()
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
