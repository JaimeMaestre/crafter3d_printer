<template>
  <table>
    <thead>
      <tr>
        <th class="title_name">Name</th>
        <th>Status</th>
        <th>Current</th>
        <th>Target</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="title_name title_nozzle">
          <font-awesome-icon :icon="['fas', 'spray-can']" class="mr_8" /> Nozzle
        </td>
        <td>
          {{ GeneralVariablesStore.temperatureStatus.hotend_status_temp ? 'ON' : 'OFF' }}
        </td>
        <td>{{ GeneralVariablesStore.temperatureStatus.hotend_current_temp.toFixed(1) }} ºC</td>
        <td>
          <div class="target_input" v-if="GeneralVariablesStore.isPrinterSubscribe">
            <input
              type="number"
              :max="GeneralVariablesStore.database.motion.default_max_hotend_temp"
              min="0"
              step="5"
              v-model.number="hotendTarget"
            />
            ºC
          </div>
        </td>
      </tr>
      <tr>
        <td class="title_name title_bed">
          <font-awesome-icon :icon="['fas', 'arrows-up-to-line']" class="mr_8" />Printing Bed
        </td>
        <td>
          {{ GeneralVariablesStore.temperatureStatus.bed_status_temp ? 'ON' : 'OFF' }}
        </td>
        <td>{{ GeneralVariablesStore.temperatureStatus.bed_current_temp.toFixed(1) }} ºC</td>
        <td>
          <div class="target_input" v-if="GeneralVariablesStore.isPrinterSubscribe">
            <input
              type="number"
              :max="GeneralVariablesStore.database.motion.default_max_bed_temp"
              min="0"
              step="5"
              v-model.number="bedTarget"
            />
            <span>ºC</span>
          </div>
        </td>
      </tr>
      <tr>
        <td class="title_name">Chamber</td>
        <td>-</td>
        <td>20ºC</td>
        <td>-</td>
      </tr>
    </tbody>
  </table>

  <div class="short_cut_heat_buttons mt_20">
    <div class="heatup_buttons">
      <button
        v-for="(profile, key) in enabledHeatProfiles"
        :key="key"
        class="btn button_primary"
        @click="activateProfile(profile)"
      >
        <font-awesome-icon :icon="['fas', 'temperature-arrow-up']" class="mr_8" />
        {{ profile.name }}
      </button>
    </div>
    <button class="btn button_red" @click="switchOff">OFF</button>
  </div>
</template>

<script setup>
import { usePrinterStore } from '@/stores/usePrinterStore.js'
import { useGeneralVariablesStore } from '@/stores/useGeneralVariablesStore.js'
import { ref, computed, watch } from 'vue'

// Variables
const PrinterStore = usePrinterStore()
const GeneralVariablesStore = useGeneralVariablesStore()
const hotendTarget = ref(GeneralVariablesStore.temperatureStatus.hotend_target_temp)
const bedTarget = ref(GeneralVariablesStore.temperatureStatus.bed_target_temp)

// Computed profiles
const enabledHeatProfiles = computed(() =>
  Object.values(GeneralVariablesStore.database.heatProfiles).filter((profile) => profile.enabled),
)

// Watchers
watch(
  () => GeneralVariablesStore.temperatureStatus.hotend_target_temp,
  (newValue) => {
    hotendTarget.value = newValue
  },
)

watch(
  () => GeneralVariablesStore.temperatureStatus.bed_target_temp,
  (newValue) => {
    bedTarget.value = newValue
  },
)

// Update store when user changes input
watch(hotendTarget, (newValue) => {
  GeneralVariablesStore.temperatureStatus.hotend_target_temp = newValue
  PrinterStore.setHotendTemperature(newValue)
})

watch(bedTarget, (newValue) => {
  GeneralVariablesStore.temperatureStatus.bed_target_temp = newValue
  PrinterStore.setBedTemperature(newValue)
})

// Methods
function switchOff() {
  hotendTarget.value = 0
  bedTarget.value = 0
}

function activateProfile(profile) {
  hotendTarget.value = profile.hotend_temperature
  bedTarget.value = profile.bed_temperature
}
</script>

<style scope>
table .title_nozzle {
  color: #ffa033;
}

table .title_bed {
  color: #a7d4ac;
}

table .table_target {
  display: flex;
  text-align: center;
  width: 150px;
}

table .target_input {
  background-color: transparent;
  border: 1px solid var(--primary-font-color);
  color: var(--primary-font-color);
  border-radius: 5px;
  text-align: center;
  text-wrap: nowrap;
  width: 110px;
}

table .target_input input {
  background-color: transparent;
  border: none;
  outline: none;
  width: 60px;
  padding: 8px 0px;
  color: var(--primary-font-color);
  font-size: 16px;
  text-align: center;
}

.short_cut_heat_buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.short_cut_heat_buttons .heatup_buttons {
  display: flex;
  flex: wrap;
  gap: 20px;
}

@media (max-width: 700px) {
  table .target_input input {
    width: 40px;
  }

  table .target_input {
    width: 80px;
  }
}
</style>
