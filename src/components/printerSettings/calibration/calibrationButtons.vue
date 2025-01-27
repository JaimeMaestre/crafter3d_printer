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
              <button class="btn button_primary font_wrap table_button">
                Verify toolhead precision
              </button>
            </td>
            <td class="title_name">
              The calibration purpose is to verify the printer movement precision. Toolhead will
              move
            </td>
          </tr>
          <tr>
            <td class="table_button">
              <button class="btn button_primary font_wrap table_button">Retraction test</button>
            </td>
            <td class="title_name">
              Toolhead is going to extrude and retray filament. It will start changing from
              extrusion to retraciton slowly and it will finish at low frequency speed.
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

<script setup></script>

<style scoped>
.table_button {
  max-width: 120px;
}
</style>
