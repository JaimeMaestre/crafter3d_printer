<template>
  <div v-if="ModalStore.visibleModalBedCalibration" class="modal">
    <div class="modal_container">
      <div class="modal_header modal_header_error">
        <div class="font_size_18_bold">Bed Calibration</div>
        <button class="btn font_size_16_bold" type="button" @click="ModalStore.closeBedCalibration">
          X
        </button>
      </div>

      <div class="modal_content">
        <div>
          What is the current position of the bed?
          <div class="modal_buttons mt_12">
            <button @click="calibratedBed(1)" class="btn button_primary">
              <font-awesome-icon :icon="['fas', 'angle-down']" class="mr_8" /> Lowest Position
            </button>
            <button @click="calibratedBed(2)" class="btn button_primary">
              <font-awesome-icon :icon="['fas', 'xmarks-lines']" class="mr_8" /> Middle Position
            </button>
            <button @click="calibratedBed(3)" class="btn button_primary">
              <font-awesome-icon :icon="['fas', 'angle-up']" class="mr_8" /> Top Position
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useGcodeStore } from '@/stores/useGcodeStore'
import { useModalStore } from '@/stores/useModalStore'

// Variables
const gCodeStore = useGcodeStore()
const ModalStore = useModalStore()

function calibratedBed(bedPosition) {
  gCodeStore.bedSensorCalibration(bedPosition)
  ModalStore.closeBedCalibration
}
</script>

<style></style>
