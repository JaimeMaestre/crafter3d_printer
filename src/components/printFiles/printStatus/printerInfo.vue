<template>
  <div class="mt_40">
    <div class="list_header">
      <div class="list_name">Printer Info</div>
      <div>Status</div>
    </div>
    <ul>
      <li>
        <div class="list_name">Homed Axes</div>
        <div>
          {{ GeneralVariablesStore.controlStatus.homed_axes.toUpperCase() || 'Not Homed' }}
          <font-awesome-icon
            :icon="['fas', 'circle']"
            class="ml_8"
            :class="
              GeneralVariablesStore.controlStatus.homed_axes === 'xyz' ? 'font_green' : 'font_red'
            "
          />
        </div>
      </li>
      <li class="hide_mobile">
        <div class="list_name">Hotend Fan</div>
        <div>
          {{ (GeneralVariablesStore.fanStatus.hotend_fan * 100).toFixed(0) }} %
          <font-awesome-icon
            :icon="['fas', 'circle']"
            class="ml_8"
            :class="GeneralVariablesStore.fanStatus.hotend_fan > 0 ? 'font_green' : 'font_red'"
          />
        </div>
      </li>
      <li class="hide_mobile">
        <div class="list_name">Blower Fan</div>
        <div>
          {{ (GeneralVariablesStore.fanStatus.layer_blower * 100).toFixed(0) }} %
          <font-awesome-icon
            :icon="['fas', 'circle']"
            class="ml_8"
            :class="GeneralVariablesStore.fanStatus.layer_blower > 0 ? 'font_green' : 'font_red'"
          />
        </div>
      </li>
      <li class="hide_mobile">
        <div class="list_name">Aux Fan</div>
        <div>
          {{ (GeneralVariablesStore.fanStatus.aux_blower * 100).toFixed(0) }} %
          <font-awesome-icon
            :icon="['fas', 'circle']"
            class="ml_8"
            :class="GeneralVariablesStore.fanStatus.aux_blower > 0 ? 'font_green' : 'font_red'"
          />
        </div>
      </li>
      <li>
        <div class="list_name">Bed Temp</div>
        <div>
          {{ GeneralVariablesStore.temperatureStatus.bed_current_temp.toFixed(1) }} ºC
          <font-awesome-icon
            :icon="['fas', 'circle']"
            class="ml_8"
            :class="
              GeneralVariablesStore.temperatureStatus.bed_power > 0 ? 'font_green' : 'font_red'
            "
          />
        </div>
      </li>
      <li>
        <div class="list_name">Hotend Temp</div>
        <div>
          {{ GeneralVariablesStore.temperatureStatus.hotend_current_temp.toFixed(1) }} ºC
          <font-awesome-icon
            :icon="['fas', 'circle']"
            class="ml_8"
            :class="
              GeneralVariablesStore.temperatureStatus.hotend_power > 0 ? 'font_green' : 'font_red'
            "
          />
        </div>
      </li>
      <li>
        <div class="list_name">Light</div>
        <div>
          {{ GeneralVariablesStore.controlStatus.led ? 'ON' : 'OFF' }}
          <font-awesome-icon
            :icon="['fas', 'circle']"
            class="ml_8"
            :class="GeneralVariablesStore.controlStatus.led ? 'font_green' : 'font_red'"
          />
        </div>
      </li>
      <li>
        <div class="list_name">Filament Status</div>
        <div>
          {{ GeneralVariablesStore.controlStatus.filament_sensor ? 'ON' : 'OFF' }}
          <font-awesome-icon
            :icon="['fas', 'circle']"
            class="ml_8"
            :class="GeneralVariablesStore.controlStatus.filament_sensor ? 'font_green' : 'font_red'"
          />
        </div>
      </li>
      <li class="hide_mobile">
        <div class="list_name">Cut Filament</div>
        <div>
          {{ GeneralVariablesStore.controlStatus.filament_cut ? 'ON' : 'OFF' }}
          <font-awesome-icon
            :icon="['fas', 'circle']"
            class="ml_8"
            :class="GeneralVariablesStore.controlStatus.filament_cut ? 'font_green' : 'font_red'"
          />
        </div>
      </li>
      <li>
        <div class="list_name">Door Status</div>
        <div>
          {{ GeneralVariablesStore.controlStatus.door_sensor ? 'ON' : 'OFF' }}
          <font-awesome-icon
            :icon="['fas', 'circle']"
            class="ml_8"
            :class="GeneralVariablesStore.controlStatus.door_sensor ? 'font_green' : 'font_red'"
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useGeneralVariablesStore } from '@/stores/useGeneralVariablesStore'

// Variables
const GeneralVariablesStore = useGeneralVariablesStore()
</script>

<style scoped>
.list_header {
  padding: 10px;
  display: flex;
  width: 100%;
  justify-content: space-between;
  border-bottom: 2px solid var(--primary-font-color);
  align-items: center;
  font-weight: bold;
}

.list_header .list_name {
  width: 60%;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

li {
  padding: 10px;
  display: flex;
  width: 100%;
  justify-content: space-between;
  border-bottom: 1px solid var(--primary-font-color);
  align-items: center;
}

li .list_name {
  width: 60%;
  white-space: nowrap;
}

@media (max-width: 800px) {
  .hide_mobile {
    display: none;
  }
}
</style>
