<template>
  <table>
    <thead>
      <tr>
        <th class="title_name">Sensor</th>
        <th>State</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="title_name" title="Standard Config">Standard</td>
        <td>
          <font-awesome-icon
            :icon="['fas', 'circle']"
            class="mr_8"
            :class="
              GeneralVariablesStore.printerConfig.position_standard ? 'font_green' : 'font_red'
            "
          />
        </td>
      </tr>
      <tr>
        <td class="title_name" title="Standard Config">Ifinite-Z</td>
        <td>
          <font-awesome-icon
            :icon="['fas', 'circle']"
            class="mr_8"
            :class="GeneralVariablesStore.printerConfig.position_45 ? 'font_green' : 'font_red'"
          />
        </td>
      </tr>
      <tr>
        <td class="title_name font_ellipsis" title="Standard Config">Filament</td>
        <td>
          <font-awesome-icon
            :icon="['fas', 'circle']"
            class="mr_8"
            :class="GeneralVariablesStore.controlStatus.filament_sensor ? 'font_green' : 'font_red'"
          />
        </td>
      </tr>
      <tr>
        <td class="title_name font_ellipsis" title="Standard Config">Door</td>
        <td>
          <font-awesome-icon
            :icon="['fas', 'circle']"
            class="mr_8"
            :class="GeneralVariablesStore.controlStatus.filament_sensor ? 'font_green' : 'font_red'"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { useGeneralVariablesStore } from '@/stores/useGeneralVariablesStore'

// Variables
const GeneralVariablesStore = useGeneralVariablesStore()
</script>

<style scoped>
table th {
  padding-top: 0px;
}

table td {
  padding: 5px 5px;
  border: none;
}
</style>
