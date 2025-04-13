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
              <button class="btn button_primary font_wrap table_button" @click="gCodeStore.zTilt()">
                <div class="font_size_18">
                  <font-awesome-icon :icon="['fas', 'arrow-down-up-across-line']" />
                </div>
                Z Bed Tilt
              </button>
            </td>
            <td class="title_name">
              If you notize that bed is tilted, run Z Bed Tilt in order to adjust calibration.
            </td>
          </tr>
          <tr>
            <td class="table_button">
              <button
                class="btn button_primary font_wrap table_button"
                @click="gCodeStore.bedSensorCalibration()"
              >
                <div class="font_size_18">
                  <font-awesome-icon :icon="['fas', 'xmarks-lines']" />
                </div>
                Bed sensor calibration
              </button>
            </td>
            <td class="title_name">
              Piezo bed sensors sensibility will be set to 0. Then the bed will start making shaking
              movements that will adjust the sensors to the right sensibility for maximum precision.
            </td>
          </tr>
          <tr>
            <td class="table_button">
              <button
                class="btn button_primary font_wrap table_button"
                @click="gCodeStore.probeAccuracy()"
              >
                <div class="font_size_18">
                  <font-awesome-icon :icon="['fas', 'location-crosshairs']" />
                </div>
                Bed sensor accuracy
              </button>
            </td>
            <td class="title_name">
              Performs multiple Z measurements at the center of the bed to check the repeatability
              of the Z offset. The test will measure 10 times and show statistics including mean,
              standard deviation, and range.
            </td>
          </tr>
          <tr>
            <td class="table_button">
              <button
                class="btn button_primary font_wrap table_button w_100"
                @click="gCodeStore.beltCalibrationStart()"
              >
                <div class="font_size_18">
                  <font-awesome-icon :icon="['fas', 'circle-radiation']" />
                </div>
                Belt Motion
              </button>
            </td>
            <td class="title_name">
              Belt will start moving until stop button is pressed. Check if belt is properly
              installed and review if is moving sideways
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useGcodeStore } from '@/stores/useGcodeStore'

const gCodeStore = useGcodeStore()
</script>

<style scoped>
.table_button {
  max-width: 150px;
}
</style>
