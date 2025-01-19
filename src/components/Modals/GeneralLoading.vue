<template>
  <div v-if="ModalStore.visibleModalLoading" class="modal">
    <div class="modal_container">
      <div class="modal_header modal_header_success">
        <div class="font_size_18_bold">
          <font-awesome-icon :icon="['fas', 'spinner']" class="mr_8" />
          Loading
        </div>
        <button class="btn font_size_16_bold" type="button" @click="ModalStore.closeModalSuccess">
          X
        </button>
      </div>

      <div class="modal_content">Loading...</div>
    </div>
  </div>
</template>

<script setup>
import { useModalStore } from '@/stores/useModalStore.js'

// Variables
const ModalStore = useModalStore()
</script>

<style scoped></style>
