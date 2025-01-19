<template>
  <div v-if="ModalStore.visibleModalAddQueue" class="modal">
    <div class="modal_container">
      <div class="modal_header">
        <div class="font_size_18_bold">
          <font-awesome-icon :icon="['fas', 'plus']" class="mr_8" />
          Add Print File
        </div>
        <button class="btn font_size_16_bold" type="button" @click="ModalStore.closeModalAddQueue">
          X
        </button>
      </div>

      <div class="modal_content">
        <div class="copies_input">
          File:
          <div class="font_ellipsis">
            {{ ModalStore.filePath }}
          </div>
        </div>
        <div class="mt_12">Copies:</div>
        <div class="copies_input mt_12">
          <button class="btn button_red" @click="changeQuantuty(-1)">-</button>
          <input class="form_input" type="number" min="0" max="300" v-model="quantity" />
          <button class="btn button_primary" @click="changeQuantuty(+1)">+</button>
        </div>
        <div class="mt_20">
          <button class="btn button_green mr_12" @click="addJobQueue()">
            <font-awesome-icon :icon="['fas', 'plus']" class="mr_8" />Add
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useModalStore } from '@/stores/useModalStore.js'
import { useJobQueueStore } from '@/stores/useJobQueueStore'

// Variables
const ModalStore = useModalStore()
const JobQueueStore = useJobQueueStore()
const quantity = ref(1)

// Methods
function addJobQueue() {
  for (let i = 0; i < quantity.value; i++) {
    JobQueueStore.addQueueJob(ModalStore.filePath)
  }
  ModalStore.closeModalAddQueue()
}

function changeQuantuty(newQuantityValue) {
  quantity.value = quantity.value + newQuantityValue
}
</script>

<style scoped>
.copies_input {
  display: flex;
  align-items: center;
  gap: 10px;
}

.form_input {
  width: 60px;
  text-align: center;
}
</style>
