<template>
  <div class="box_content_large control">
    <div class="box_content_header">
      <div>
        <font-awesome-icon :icon="['fas', 'arrows-up-down-left-right']" class="mr_8" /> Printer
        Control
      </div>
      <div
        v-if="box_visible_printerControl === false"
        class="open_button"
        @click="box_visible_printerControl = true"
      >
        <font-awesome-icon :icon="['fas', 'angle-down']" />
      </div>
      <div
        v-if="box_visible_printerControl === true"
        class="open_button"
        @click="box_visible_printerControl = false"
      >
        <font-awesome-icon :icon="['fas', 'angle-up']" />
      </div>
    </div>

    <div v-if="box_visible_printerControl === true">
      <webCam />

      <div class="box_content_info">
        <div class="control_panel_flex flex_reverse">
          <div class="flex_right">
            <shortCuts />
          </div>

          <div class="position flex_left">
            <currentPosition />
          </div>
        </div>

        <div class="control_panel_flex mt_32">
          <div class="flex_left">
            <controlMotors />
          </div>

          <div class="fan_buttons flex_right">
            <controlFans />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import webCam from '@/components/printerDashboard/printerControl/webCam.vue'
import controlMotors from '@/components/printerDashboard/printerControl/controlMotors.vue'
import shortCuts from '@/components/printerDashboard/printerControl/shortCuts.vue'
import controlFans from '@/components/printerDashboard/printerControl/controlFans.vue'
import currentPosition from '@/components/printerDashboard/printerControl/currentPosition.vue'
import { ref } from 'vue'

const box_visible_printerControl = ref(true)
</script>

<style scope>
.control_panel_flex {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 32px;
}

.flex_reverse {
  flex-direction: row-reverse;
}

.control_panel_flex .flex_left {
  flex: 1 1 50%;
}

.control_panel_flex .flex_right {
  flex: 1 1 300px;
}
</style>
