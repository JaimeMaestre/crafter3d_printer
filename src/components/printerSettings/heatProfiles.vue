<template>
  <div class="box_content_small mt_32">
    <div class="box_content_header">
      <div>
        <font-awesome-icon :icon="['fas', 'temperature-three-quarters']" class="mr_8" />
        {{ $t(`printerSettings_heatProfiles.header`) }}
      </div>
    </div>

    <div class="box_content_info">
      <ul v-for="(profile, key) in GeneralVariablesStore.database.heatProfiles" :key="key">
        <li class="li_title header_profile">
          <div>
            <font-awesome-icon :icon="['fas', 'temperature-three-quarters']" class="mr_8" />
            {{ profile.name }} {{ $t('printerSettings_heatProfiles.profile') }}
          </div>
          <button
            class="btn ml_8"
            :class="profile.enabled ? 'button_complementary' : 'button_complementary_empty'"
            @click="toggleHeatProfile(key)"
          >
            {{ profile.enabled ? 'Enabled' : 'Disabled' }}
          </button>
        </li>
        <li>
          <ul>
            <li class="d_flex">
              <font-awesome-icon
                :icon="['fas', 'arrows-up-to-line']"
                class="mr_8 font_complementary"
              />
              {{ $t('printerSettings_heatProfiles.bed_target') }}
              <input
                class="form_input_transparent form_input_temp"
                type="number"
                :max="GeneralVariablesStore.database.motion.default_max_bed_temp"
                min="0"
                v-model.number="profile.bed_temperature"
              />
              ºC
            </li>
            <li class="d_flex">
              <font-awesome-icon :icon="['fas', 'spray-can']" class="mr_8 font_complementary" />
              {{ $t('printerSettings_heatProfiles.hotend_target') }}
              <input
                class="form_input_transparent form_input_temp"
                type="number"
                :max="GeneralVariablesStore.database.motion.default_max_hotend_temp"
                min="0"
                v-model.number="profile.hotend_temperature"
              />
              ºC
            </li>
            <li v-if="key === 'Custom'" class="d_flex">
              {{ $t('general.name') }}
              <input
                class="form_input_transparent form_input_name"
                type="text"
                v-model="profile.name"
              />
            </li>
          </ul>
        </li>
      </ul>

      <div class="save_button">
        <button class="btn button_green font_size_16" @click="DatabaseStore.updateDatabase">
          <font-awesome-icon :icon="['fas', 'floppy-disk']" class="mr_8" /> {{ $t('general.save') }}
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
function toggleHeatProfile(key) {
  GeneralVariablesStore.database.heatProfiles[key].enabled =
    !GeneralVariablesStore.database.heatProfiles[key].enabled
}
</script>

<style scoped>
.save_button {
  margin-top: 30px;
  text-align: right;
}

.header_profile {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.form_input_temp {
  text-align: center;
  width: 70px;
  margin-left: 8px;
  margin-right: 8px;
}

.form_input_name {
  text-align: center;
  width: 100px;
  margin-left: 8px;
  margin-right: 8px;
}

ul {
  list-style: none;
  padding: 0px;
}
li {
  list-style: none;
  padding: 10px;
}

.li_title {
  border-bottom: 1px solid var(--primary-font-color);
}
</style>
