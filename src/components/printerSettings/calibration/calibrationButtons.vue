<template>
  <div class="box_content_large">
    <div class="box_content_header">
      <div>
        <font-awesome-icon :icon="['fas', 'ruler-vertical']" class="mr_8" />
        Printer Calibration
      </div>
    </div>

    <div class="box_content_info">
      <table class="mb_32">
        <thead>
          <tr>
            <th class="table_button">Calibration</th>
            <th class="title_name">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="table_button">
              <button
                class="btn button_primary font_wrap table_button"
                @click="printerStore.calibrationHomingPrecision"
              >
                Homming precision
              </button>
            </td>
            <td class="title_name">
              After conducting a full axes home, place the dial gauge on a position where Toolhead
              is reading a value. Set the dial gauge to zero and press homming precision test. The
              homming precision test will home full axes 5 times and stop on steps of 3 seconds in
              order to get dial gauge values.
            </td>
          </tr>
          <tr>
            <td class="table_button">
              <button
                class="btn button_primary font_wrap table_button"
                @click="printerStore.calibrationXYPrecision(10)"
              >
                XY motion precision
              </button>
            </td>
            <td class="title_name">
              Toolhead will move from 0 position to the home position increasing the speed from
            </td>
          </tr>
          <tr>
            <td class="table_button">
              <button class="btn button_primary font_wrap table_button">
                Resonance Calibration
              </button>
            </td>
            <td class="title_name">
              The toolhead will move at different frecuencies to make a resosnance calibraiton
            </td>
          </tr>
          <tr>
            <td class="table_button">
              <button class="btn button_primary font_wrap table_button">Input shaper</button>
            </td>
            <td class="title_name">Calibrate extruder input shaper</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { usePrinterStore } from '@/stores/usePrinterStore'
const printerStore = usePrinterStore()
</script>

<style scoped>
.table_button {
  max-width: 120px;
}
</style>
