<template>
  <div
    v-if="
      (!GeneralVariablesStore.isWebsocketConnected ||
        GeneralVariablesStore.mcuStatus.mcu_state != 'ready') &&
      GeneralVariablesStore.isWebsocketConnected
    "
    class="modal"
    id="printerConnectionErrorModal"
  >
    <div class="modal_container">
      <div class="modal_header modal_header_error">
        <div class="font_size_18_bold">
          <font-awesome-icon :icon="['fas', 'plug-circle-exclamation']" class="mr_8" />Printer
          Connection Error
        </div>
        <button class="btn font_size_16_bold" type="button" @click="closeModal">X</button>
      </div>

      <div class="modal_content">
        <div v-if="!GeneralVariablesStore.isWebsocketConnected">
          <div>
            <span class="font_size_16_bold">
              <font-awesome-icon :icon="['fas', 'plug']" class="mr_8 font_blue" /> Moonraker:
            </span>
            No connected
          </div>
          <div>
            <span class="font_size_16_bold">
              <font-awesome-icon :icon="['fas', 'circle-exclamation']" class="mr_8 font_red" />
              Error:
            </span>
            Printer is not powered or it does not have internet connection.
          </div>
        </div>
        <div v-if="GeneralVariablesStore.mcuStatus.mcu_state != 'ready'">
          <div>
            <span class="font_size_16_bold">
              <font-awesome-icon :icon="['fas', 'plug']" class="mr_8 font_blue" /> Klipper Server:
            </span>
            {{ GeneralVariablesStore.mcuStatus.klippy ? 'Connected' : 'Disconnected' }}
          </div>
          <div>
            <span class="font_size_16_bold">
              <font-awesome-icon :icon="['fas', 'chalkboard']" class="mr_8 font_blue" /> MCU state:
            </span>
            {{ GeneralVariablesStore.mcuStatus.mcu_state }}
          </div>
          <div>
            <span class="font_size_16_bold">
              <font-awesome-icon :icon="['fas', 'file-pen']" class="mr_8 font_blue" /> Notes:</span
            >
            {{ GeneralVariablesStore.mcuStatus.status }}
          </div>
          <div>
            <span class="font_size_16_bold">
              <font-awesome-icon :icon="['fas', 'triangle-exclamation']" class="mr_8 font_gold" />
              Warnnings:
            </span>
            {{ GeneralVariablesStore.mcuStatus.warnnings || 'No Warnings' }}
          </div>
        </div>

        <div class="mt_12 modal_buttons">
          <button
            v-if="
              !GeneralVariablesStore.isWebsocketConnected ||
              GeneralVariablesStore.mcuStatus.mcu_state != 'ready'
            "
            class="btn button_primary"
            @click="refreshPage"
          >
            <font-awesome-icon :icon="['fas', 'arrows-rotate']" class="mr_8" /> Try again
          </button>
          <button
            v-if="GeneralVariablesStore.mcuStatus.mcu_state != 'ready'"
            class="btn button_primary ml_12"
            @click="MoonrakerStore.resetFirmware()"
          >
            <font-awesome-icon :icon="['fas', 'power-off']" class="mr_8" /> Reset Firmware
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useMoonrakerStore } from '@/stores/useMoonrakerStore'
import { useGeneralVariablesStore } from '@/stores/useGeneralVariablesStore'

// Variables
const MoonrakerStore = useMoonrakerStore()
const GeneralVariablesStore = useGeneralVariablesStore()

// Methods
const refreshPage = () => {
  window.location.reload() // Reloads the current page
}

const closeModal = () => {
  const modalElement = document.getElementById('printerConnectionErrorModal')
  if (modalElement) {
    modalElement.style.display = 'none'
  }
}
</script>

<style></style>
