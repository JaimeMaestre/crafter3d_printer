<template>
  <div class="box_content_small mt_32">
    <div class="box_content_header">
      <div>
        <font-awesome-icon :icon="['fas', 'gear']" class="mr_8" />
        {{ $t(`printerSettings_others.header`) }}
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
          <tr>
            <td class="title_name">{{ $t(`printerSettings_others.recent_files`) }}</td>
            <td>
              <div class="d_flex">
                <input
                  class="form_input_transparent"
                  type="number"
                  v-model.number="GeneralVariablesStore.database.others.countLatestPrintFiles"
                />
                {{ $t(`general.files`) }}
              </div>
            </td>
          </tr>
          <tr>
            <td class="title_name">{{ $t(`printerSettings_others.language`) }}</td>
            <td>
              <div class="d_flex">
                <select
                  class="form_input_transparent form_language"
                  v-model="GeneralVariablesStore.database.others.language"
                >
                  <option
                    v-for="(language, index) in GeneralVariablesStore.database.languages"
                    :key="index"
                    :value="language.code"
                  >
                    {{ language.name }}
                  </option>
                </select>
              </div>
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
</script>

<style scoped>
.form_input_transparent {
  text-align: center;
  width: 70px;
  margin-left: 8px;
  margin-right: 8px;
}

.form_language {
  text-align: left;
  width: 120px;
}
.save_button {
  margin-top: 30px;
  text-align: right;
}
</style>
