<template>
  <div v-if="ModalStore.visibleModalForgetWifi" class="modal">
    <div class="modal_container">
      <div class="modal_header modal_header_error">
        <div class="font_size_18_bold">
          <font-awesome-icon :icon="['fas', 'wifi']" class="mr_8" />
          Forget Wifi
        </div>
        <button
          class="btn font_size_16_bold"
          type="button"
          @click="ModalStore.closeModalForgetWifi"
        >
          X
        </button>
      </div>

      <div class="modal_content">
        Forget {{ ModalStore.ssidModalForgetWifi }}?
        <div class="mt_20">
          <button
            class="btn button_green mr_12"
            @click="forgetNetwork(ModalStore.ssidModalForgetWifi)"
          >
            Yes
          </button>
          <button class="btn button_primary mr_12" @click="ModalStore.closeModalForgetWifi">
            No
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useModalStore } from '@/stores/useModalStore.js'
import { useCrafterAPIStore } from '@/stores/useCrafterAPIStore'

// Variables
const ModalStore = useModalStore()
const CrafterAPIStore = useCrafterAPIStore()

// Methods
async function forgetNetwork(ssid) {
  await CrafterAPIStore.forgetConnection(ssid)
  ModalStore.closeModalForgetWifi()
}
</script>

<style scoped>
.ssid_input {
  display: flex;
  align-items: center;
  gap: 10px;
}

.form_input {
  max-width: 300px;
}
</style>
