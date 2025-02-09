<template>
  <div v-if="ModalStore.visibleModalAddWifi" class="modal">
    <div class="modal_container">
      <div class="modal_header">
        <div class="font_size_18_bold">
          <font-awesome-icon :icon="['fas', 'wifi']" class="mr_8" />
          Add new wifi
        </div>
        <button class="btn font_size_16_bold" type="button" @click="ModalStore.closeModalAddWifi">
          X
        </button>
      </div>

      <div class="modal_content">
        {{ ModalStore.ssidModalAddWifi }} ({{ ModalStore.securityModalAddWifi }})
        <div class="mt_12">
          <input class="form_input" type="text" v-model="password" placeholder="Password" />
        </div>
        <div class="mt_20">
          <button
            class="btn button_green mr_12"
            @click="saveConnection(ModalStore.ssidModalAddWifi)"
          >
            <font-awesome-icon :icon="['fas', 'plus']" class="mr_8" />Save
          </button>
          <button class="btn button_primary mr_12" @click="ModalStore.closeModalAddWifi">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useModalStore } from '@/stores/useModalStore.js'
import { useCrafterAPIStore } from '@/stores/useCrafterAPIStore'

// Variables
const ModalStore = useModalStore()
const CrafterAPIStore = useCrafterAPIStore()
const password = ref('')

// Methods
async function saveConnection(ssid) {
  ModalStore.closeModalAddWifi()
  await CrafterAPIStore.newWifiConnection(ssid, password.value)
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
