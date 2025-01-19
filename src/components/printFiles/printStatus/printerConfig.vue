<template>
  <div class="printer_config_container">
    <div class="printer_position mt_20">
      <div class="printer_image">
        <img
          class="image_round"
          :src="
            GeneralVariablesStore.printerConfig.position_standard &&
            !GeneralVariablesStore.printerConfig.position_45
              ? '/public/images/printer_45.png'
              : '/public/images/printer_90.png'
          "
          alt="Crafter 3D printer standard"
        />
        <div class="mt_4">
          <div>
            <font-awesome-icon
              :icon="['fas', 'circle']"
              class="mr_8"
              :class="
                GeneralVariablesStore.printerConfig.position_standard ? 'font_green' : 'font_red'
              "
            />
            Standard Switch
          </div>
          <div>
            <font-awesome-icon
              :icon="['fas', 'circle']"
              class="mr_8"
              :class="GeneralVariablesStore.printerConfig.position_45 ? 'font_green' : 'font_red'"
            />
            Ifinite-Z Switch
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGeneralVariablesStore } from '@/stores/useGeneralVariablesStore'

// Variables
const GeneralVariablesStore = useGeneralVariablesStore()
</script>

<style scoped>
.printer_config_container {
  justify-items: center;
}

.printer_position .printer_image {
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  width: fit-content;
}

.printer_position .printer_image img {
  display: block;
  width: 100%;
}
</style>
