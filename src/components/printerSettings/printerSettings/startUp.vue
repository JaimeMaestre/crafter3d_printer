<template>
  <div class="box_content_small">
    <div class="box_content_header">
      <div>
        <font-awesome-icon :icon="['fas', 'power-off']" class="mr_8" />
        {{ $t(`printerSettings_startup.header`) }}
      </div>
    </div>

    <div class="box_content_info">
      <table>
        <thead>
          <tr>
            <th class="title_name">{{ $t(`general.name`) }}</th>
            <th>{{ $t(`general.opt`) }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in GeneralVariablesStore.database.startUp" :key="index">
            <td class="title_name">
              <font-awesome-icon :icon="['fas', item.icon]" class="mr_8" />
              {{ $t(`printerSettings_startup.${item.key}_start`) }}
            </td>
            <td>
              <button
                class="btn"
                :class="item.value ? 'button_complementary' : 'button_complementary_empty'"
                @click="toggleStartupOption(item.key)"
              >
                {{ item.value ? $t(`general.on`) : $t(`general.off`) }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="save_button">
        <button class="btn button_green font_size_16" @click="DatabaseStore.updateDatabase">
          <font-awesome-icon :icon="['fas', 'floppy-disk']" class="mr_8" /> {{ $t(`general.save`) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGeneralVariablesStore } from '@/stores/useGeneralVariablesStore'
import { useDatabaseStore } from '@/stores/useDatabaseStore'

// Variables
const GeneralVariablesStore = useGeneralVariablesStore()
const DatabaseStore = useDatabaseStore()

// Methods
function toggleStartupOption(key) {
  console.log(GeneralVariablesStore.database.startUp[key].value)
  GeneralVariablesStore.database.startUp[key].value =
    !GeneralVariablesStore.database.startUp[key].value
}
</script>

<style scoped>
.save_button {
  margin-top: 30px;
  text-align: right;
}
</style>
