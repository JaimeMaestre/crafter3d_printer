<template>
  <h3 class="mt_0 mb_24">Current position</h3>

  <div class="current_position">
    <div class="axis_position">
      <div class="div_input">
        <div class="title">X</div>
        <div>{{ GeneralVariablesStore.controlStatus.current_position[0].toFixed(1) }} mm</div>
      </div>
      <div class="div_input">
        <div class="title">Y</div>
        <div>{{ GeneralVariablesStore.controlStatus.current_position[1].toFixed(1) }} mm</div>
      </div>
      <div class="div_input">
        <div class="title">Z</div>
        <div>{{ GeneralVariablesStore.controlStatus.current_position[2].toFixed(1) }} mm</div>
      </div>
    </div>

    <div class="printer_position mt_20">
      <div class="printer_image">
        <img
          class="image_150 image_round"
          :src="
            GeneralVariablesStore.printerConfig.position_standard &&
            !GeneralVariablesStore.printerConfig.position_45
              ? '/public/images/printer_90.png'
              : '/public/images/printer_45.png'
          "
          alt="Crafter 3D printer standard"
        />
      </div>
      <div class="printer_sensors">
        <tableSensor />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGeneralVariablesStore } from '@/stores/useGeneralVariablesStore'
import tableSensor from '@/components/printerDashboard/printerControl/tableSensor.vue'

// Variables
const GeneralVariablesStore = useGeneralVariablesStore()
</script>

<style scoped>
.current_position .axis_position {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 300px;
}

.current_position .axis_position .div_input .title {
  position: absolute;
  background-color: var(--grey-color-12);
  padding: 2px 0px;
  top: -15px;
  left: 10px;
}

.current_position .printer_position {
  display: flex;
  gap: 10px;
}

.current_position .printer_position .printer_image {
  padding: 10px;
  background-color: black;
  border-radius: 5px;
  width: fit-content;
}

.current_position .printer_position .printer_sensors {
  max-width: 200px;
}
</style>
