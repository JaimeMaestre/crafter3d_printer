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
        <td>{{ Math.round(GeneralVariablesStore.temperatureStatus.hotend_current_temp) }} ºC</td>
        <td>
          <div class="target_input">
            <input
              type="number"
              :max="GeneralVariablesStore.default_max_hotend_temp"
              min="0"
              step="5"
              value="0"
              v-model.number="hotendTargetInput"
              @change="PrinterStore.setHotendTemperature($event.target.value)"
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
        <td>{{ Math.round(GeneralVariablesStore.temperatureStatus.bed_current_temp) }} ºC</td>
        <td>
          <div class="target_input">
            <input
              type="number"
              max="120"
              min="0"
              step="5"
              value="0"
              v-model.number="bedTargetInput"
              @change="PrinterStore.setBedTemperature($event.target.value)"
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
import { ref, computed } from 'vue'

const PrinterStore = usePrinterStore()
const GeneralVariablesStore = useGeneralVariablesStore()
const hotendTargetInput = ref(0)
const bedTargetInput = ref(0)

// Computed
const enabledHeatProfiles = computed(() =>
  Object.values(GeneralVariablesStore.database.heatProfiles).filter((profile) => profile.enabled),
)

const waitForHotendTarget = new Promise((resolve) => {
  const checkConnection = setInterval(() => {
    if (GeneralVariablesStore.is_hotend_target === true) {
      clearInterval(checkConnection)
      resolve()
    }
  }, 100)
})
waitForHotendTarget.then(() => {
  hotendTargetInput.value = Math.round(PrinterStore.temperatureStatus.hotend_target_temp)
})

const waitForBedTarget = new Promise((resolve) => {
  const checkConnection = setInterval(() => {
    if (GeneralVariablesStore.is_bed_target === true) {
      clearInterval(checkConnection)
      resolve()
    }
  }, 100)
})
waitForBedTarget.then(() => {
  bedTargetInput.value = Math.round(PrinterStore.temperatureStatus.bed_target_temp)
})

// Methods
function switchOff() {
  bedTargetInput.value = 0
  PrinterStore.offBedTemperature()
  hotendTargetInput.value = 0
  PrinterStore.offHotendTemperature()
}

function activateProfile(profile) {
  PrinterStore.setHotendTemperature(profile.hotend_temperature)
  PrinterStore.setBedTemperature(profile.bed_temperature)
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
