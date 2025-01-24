<template>
  <div class="modal" v-if="!GeneralVariablesStore.isWebsocketConnected">
    <div class="modal_container">
      <div class="modal_header modal_header_error">
        <div class="font_size_18_bold">
          <font-awesome-icon :icon="['fas', 'plug-circle-exclamation']" class="mr_8" />Error
          Moonraker connection
        </div>
      </div>

      <div class="modal_content">
        <div>
          Rpi controller is unable stablish connection with Moonraker. It could be caused by wrong
          moonraker configurtion.
        </div>
        <div class="mt_12 modal_buttons">
          <button class="btn button_primary" @click="refreshPage">
            <font-awesome-icon :icon="['fas', 'arrows-rotate']" class="mr_8" /> Try again
          </button>
          <button class="btn button_primary" @click="ServerInfoStore.resetFirmware()">
            <font-awesome-icon :icon="['fas', 'power-off']" class="mr_8" /> Reset Firmware
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useServerInfoStore } from '@/stores/useServerInfoStore.js'
import { useGeneralVariablesStore } from '@/stores/useGeneralVariablesStore.js'

// Variables
const ServerInfoStore = useServerInfoStore()
const GeneralVariablesStore = useGeneralVariablesStore()

// Methods
const refreshPage = () => {
  window.location.reload() // Reloads the current page
}
</script>

<style></style>
