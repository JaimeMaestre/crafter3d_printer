<template>
  <div class="box_content_small mt_32">
    <div class="box_content_header">
      <div>
        <font-awesome-icon :icon="['fas', 'chalkboard']" class="mr_8" />
        {{ $t(`printerSettings_motion.header`) }}
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
          <tr v-for="(motion, key) in GeneralVariablesStore.database.motion" :key="key">
            <td class="title_name">
              <font-awesome-icon :icon="['fas', motion.icon]" class="mr_8" />
              {{ $t(`printerSettings_motion.${motion.translationKey}`) }}
            </td>
            <td>
              <div class="d_flex">
                <input class="form_input_transparent" type="number" v-model.number="motion.value" />
                {{ motion.unit }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="save_button">
        <button class="btn button_green font_size_16" @click="DatabaseStore.updateDatabase">
          <font-awesome-icon :icon="['fas', 'floppy-disk']" class="mr_8" />{{ $t(`general.save`) }}
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
.save_button {
  margin-top: 30px;
  text-align: right;
}

.form_input_transparent {
  text-align: center;
  width: 70px;
  margin-left: 8px;
  margin-right: 8px;
}
</style>
