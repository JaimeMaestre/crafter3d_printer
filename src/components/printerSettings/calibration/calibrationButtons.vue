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
                @click="ModalStore.showBedCalibration()"
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
                @click="gCodeStore.inputShaper()"
              >
                <div class="font_size_18">
                  <font-awesome-icon :icon="['fas', 'wave-square']" />
                </div>
                Ipunt Shaper
              </button>
            </td>
            <td class="title_name">
              Run input shaper to calibrate the printer with new input shaper parameters. New
              parameters will be automatically stored and updated. Printer will restart.
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
          <tr>
            <td class="table_button">
              <button
                class="btn button_primary font_wrap table_button w_100"
                @click="gCodeStore.bedMesh()"
              >
                <div class="font_size_18">
                  <font-awesome-icon :icon="['fas', 'table-cells']" />
                </div>
                Bed Mesh
              </button>
            </td>
            <td class="title_name">
              Conduct bed mesh calibration, then click on Save Mesh to save the calibration.
            </td>
          </tr>
          <tr>
            <td class="table_button">
              <button
                class="btn button_green font_wrap table_button w_100 mt_8"
                @click="gCodeStore.saveConfig()"
              >
                Save Config
              </button>
            </td>
            <td class="title_name">Press Save Config after running all the calibration steps.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <bedCalibrationModal />
</template>

<script setup>
import { useGcodeStore } from '@/stores/useGcodeStore'
import { useModalStore } from '@/stores/useModalStore'
import bedCalibrationModal from '@/components/Modals/bedCalibrationModal.vue'

const gCodeStore = useGcodeStore()
const ModalStore = useModalStore()
</script>

<style scoped>
.table_button {
  max-width: 150px;
}
</style>
