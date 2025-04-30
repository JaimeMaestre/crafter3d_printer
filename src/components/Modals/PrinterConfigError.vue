<template>
  <div
    class="modal"
    v-if="
      GeneralVariablesStore.printerAxesConfigError &&
      GeneralVariablesStore.mcuStatus.mcu_state == 'ready' &&
      GeneralVariablesStore.isWebsocketConnected
    "
  >
    <div class="modal_container">
      <div class="modal_header modal_header_error">
        <div class="font_size_18_bold">
          <font-awesome-icon :icon="['fas', 'plug-circle-exclamation']" class="mr_8" />Unkown Core
          XY configuration
        </div>
      </div>

      <div class="modal_content">
        <div>
          The Core XY frame is on an unknown configuration, mechanical switched feedback
          <ul>
            <li>
              <span class="mr_8">Top Switch:</span>
              <span
                :class="
                  GeneralVariablesStore.printerConfig.position_standard ? 'font_green' : 'font_red'
                "
                ><font-awesome-icon :icon="['fas', 'circle']" class="mr_4"
              /></span>
              {{ GeneralVariablesStore.printerConfig.position_standard ? 'ON' : 'OFF' }}
            </li>
            <li>
              <span class="mr_8">45 switch:</span>

              <span
                :class="GeneralVariablesStore.printerConfig.position_45 ? 'font_green' : 'font_red'"
                ><font-awesome-icon :icon="['fas', 'circle']" class="mr_4"
              /></span>
              {{ GeneralVariablesStore.printerConfig.position_45 ? 'ON' : 'OFF' }}
            </li>
          </ul>
        </div>
        <div class="mt_12 modal_buttons">
          <button class="btn button_primary" @click="refreshPage">
            <font-awesome-icon :icon="['fas', 'arrows-rotate']" class="mr_8" /> Try again
          </button>
          <button class="btn button_primary" @click="MoonrakerStore.resetFirmware()">
            <font-awesome-icon :icon="['fas', 'power-off']" class="mr_8" /> Reset Firmware
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useMoonrakerStore } from '@/stores/useMoonrakerStore.js'
import { useGeneralVariablesStore } from '@/stores/useGeneralVariablesStore.js'

// Variables
const MoonrakerStore = useMoonrakerStore()
const GeneralVariablesStore = useGeneralVariablesStore()

// Methods
const refreshPage = () => {
  window.location.reload() // Reloads the current page
}
</script>

<style></style>
