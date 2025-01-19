<template>
  <div v-if="ModalStore.visibleModalSuccess" class="ml_12">
    <div class="modal_container_success">
      <div class="modal_header modal_header_success">
        <div class="font_size_18_bold">
          <font-awesome-icon :icon="['fas', 'circle-check']" class="mr_8" />
          Success
        </div>
        <button class="btn font_size_16_bold" type="button" @click="ModalStore.closeModalSuccess">
          X
        </button>
      </div>

      <div class="modal_content">
        <div>{{ ModalStore.successMessage }}</div>
        <button class="btn button_primary mt_12" @click="ModalStore.closeModalSuccess">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useModalStore } from '@/stores/useModalStore.js'

// Variables
const ModalStore = useModalStore()
</script>

<style scoped></style>
