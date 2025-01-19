<template>
  <div class="box_content_small">
    <div class="box_content_header">
      <div><font-awesome-icon :icon="['fas', 'eye']" class="mr_8" /> Printer Status</div>
      <div
        v-if="box_visible_printerStatus === false"
        class="open_button"
        @click="box_visible_printerStatus = true"
      >
        <font-awesome-icon :icon="['fas', 'angle-down']" />
      </div>
      <div
        v-if="box_visible_printerStatus === true"
        class="open_button"
        @click="box_visible_printerStatus = false"
      >
        <font-awesome-icon :icon="['fas', 'angle-up']" />
      </div>
    </div>

    <div v-if="box_visible_printerStatus === true" class="box_content_info">
      <printerConfig />
      <printerInfo />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import printerConfig from '@/components/printFiles/printStatus/printerConfig.vue'
import printerInfo from '@/components/printFiles/printStatus/printerInfo.vue'

// Variables
const box_visible_printerStatus = ref(true)
</script>

<style scoped></style>
