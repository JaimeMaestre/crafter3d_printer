<template>
  <div class="box_content_large temperatures mt_40">
    <div class="box_content_header">
      <div>
        <font-awesome-icon :icon="['fas', 'temperature-three-quarters']" class="mr_8" />
        Temperatures
      </div>
      <div
        v-if="box_visible_printerTemperature === false"
        class="open_button"
        @click="box_visible_printerTemperature = true"
      >
        <font-awesome-icon :icon="['fas', 'angle-down']" />
      </div>
      <div
        v-if="box_visible_printerTemperature === true"
        class="open_button"
        @click="box_visible_printerTemperature = false"
      >
        <font-awesome-icon :icon="['fas', 'angle-up']" />
      </div>
    </div>

    <div class="box_content_info" v-if="box_visible_printerTemperature === true">
      <div>
        <temperatureTable />
      </div>

      <div class="mt_20">
        <TemperatureGraph />
      </div>
    </div>
  </div>
</template>

<script setup>
import TemperatureGraph from '@/components/printerDashboard/printerTemperature/temperatureGraph.vue'
import temperatureTable from '@/components/printerDashboard/printerTemperature/temperatureTable.vue'
import { ref } from 'vue'

const box_visible_printerTemperature = ref(true)
</script>

<style scope></style>
