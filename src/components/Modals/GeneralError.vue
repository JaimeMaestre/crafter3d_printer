<template>
  <div v-if="ModalStore.visibleModalError" class="modal">
    <div class="modal_container">
      <div class="modal_header modal_header_error">
        <div class="font_size_18_bold">
          <font-awesome-icon :icon="['fas', 'circle-xmark']" class="mr_8" />
          Error
        </div>
        <button class="btn font_size_16_bold" type="button" @click="ModalStore.closeModalError">
          X
        </button>
      </div>

      <div class="modal_content">
        <div>{{ ModalStore.errorMessage }}</div>
        <button class="btn button_primary mt_12" @click="ModalStore.closeModalError">Close</button>
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
