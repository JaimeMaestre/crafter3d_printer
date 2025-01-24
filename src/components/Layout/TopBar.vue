<template>
  <header>
    <div class="left_header">
      <div class="menu_icon" @click="toggleSideMenu">
        <font-awesome-icon icon="fa-solid fa-bars" />
      </div>
      <div class="logo">
        <img src="/public/android-chrome-512x512.png" alt="Crafter3D Logo" class="image_50" />
      </div>
      <div class="font_size_14 printer_name">
        <div class="printer_code">
          {{
            GeneralVariablesStore.hostname
              .replace('.local', '')
              .replace('crafter-m6', 'C3D')
              .toUpperCase()
          }}
        </div>
        <div
          v-if="GeneralVariablesStore.mcuStatus.mcu_state != 'ready'"
          class="font_red font_extra_bold font_size_14_bold"
        >
          {{ $t('topBar.status_no_connected') }}
        </div>
        <div
          v-if="GeneralVariablesStore.mcuStatus.mcu_state == 'ready'"
          class="font_green font_extra_bold font_size_14_bold"
        >
          {{ $t('topBar.status_connected') }}
        </div>
      </div>
    </div>
    <nav>
      <router-link to="/" class="nav_button font_size_16" active-class="nav_button_active">
        <font-awesome-icon :icon="['fas', 'gamepad']" class="mr_8" />
        {{ $t('topBar.dashboard') }}
      </router-link>
      <router-link
        to="/print-files"
        class="nav_button font_size_16"
        active-class="nav_button_active"
      >
        <font-awesome-icon :icon="['fas', 'file']" class="mr_8" />
        {{ $t('topBar.printFiles') }}
      </router-link>
      <router-link to="/settings" class="nav_button font_size_16" active-class="nav_button_active">
        <font-awesome-icon :icon="['fas', 'wrench']" class="mr_8" />
        {{ $t('topBar.settings') }}
      </router-link>
      <a
        href="https://mito3d.com/"
        target="_blank"
        class="nav_button font_size_16"
        active-class="nav_button_active"
        >{{ $t('topBar.models') }}</a
      >
    </nav>
    <div class="right_header">
      <div class="mr_16">
        <button class="btn button_red font_size_14" @click="ServerInfoStore.emergencyStop()">
          <font-awesome-icon :icon="['fas', 'circle-exclamation']" class="mr_6" />
          <span class="emergency_mobile">{{ $t('topBar.stop') }}</span>
          <span class="emergency_desktop">{{ $t('topBar.emergency_stop') }}</span>
        </button>
      </div>
      <div class="language">
        <div class="mr_8 font_size_18">
          <font-awesome-icon :icon="['fas', 'globe']" />
        </div>
        <div class="language_dropdown">
          <button class="font_size_16" type="button">
            <span>{{ GeneralVariablesStore.database.others.language.toUpperCase() }}</span>
            <font-awesome-icon :icon="['fas', 'angle-down']" />
          </button>
          <div class="dropdown_content font_size_16">
            <a
              v-for="language in GeneralVariablesStore.database.languages"
              :key="language.code"
              @click="changeLanguage(language.code)"
            >
              {{ language.name }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useServerInfoStore } from '@/stores/useServerInfoStore'
import { useGeneralVariablesStore } from '@/stores/useGeneralVariablesStore'
import { useDatabaseStore } from '@/stores/useDatabaseStore'
import { useI18n } from 'vue-i18n'

// Variables
const ServerInfoStore = useServerInfoStore()
const GeneralVariablesStore = useGeneralVariablesStore()
const DatabaseStore = useDatabaseStore()
const { locale } = useI18n()

// Methods
const toggleSideMenu = () => {
  GeneralVariablesStore.side_menu_visibility = !GeneralVariablesStore.side_menu_visibility
}

const changeLanguage = (lang) => {
  GeneralVariablesStore.database.others.language = lang
  locale.value = GeneralVariablesStore.database.others.language
  DatabaseStore.updateDatabase()
}
</script>

<style scope>
header {
  background: var(--grey-color-12);
  border-bottom: 1px solid var(--grey-color-4);
  color: var(--primary-font-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--header-padding);
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 10;
}

header .left_header {
  display: flex;
  align-items: center;
}

header .left_header .menu_icon {
  display: none;
}

header .left_header .logo {
  margin-left: 15px;
}

header .left_header .printer_name {
  margin-left: 12px;
}

header .left_header .printer_code {
  margin-bottom: -6px;
}

header nav {
  display: flex;
}

header nav .nav_button {
  padding: 0 30px;
  padding: 15px;
  cursor: pointer;
  text-decoration: none;
  color: var(--primary-font-color);
}

header nav .nav_button:hover,
.nav_button_active {
  background-color: var(--primary-color-9);
}

header .right_header {
  display: flex;
  align-items: center;
}

header .right_header .emergency_desktop {
  display: inherit;
}

header .right_header .emergency_mobile {
  display: none;
}

header .right_header .language {
  display: flex;
  align-items: center;
  margin-right: 15px;
}

header .right_header .language .language_dropdown {
  cursor: pointer;
}

header .right_header .language .language_dropdown button {
  border: none;
  outline: none;
  color: var(--primary-font-color);
  padding: 14px 0;
  background-color: transparent;
  cursor: pointer;
}

header .right_header .language .language_dropdown button span {
  margin-right: 8px;
}

header .right_header .language .language_dropdown .dropdown_content {
  display: none;
  position: absolute;
  background-color: var(--grey-color-12);
  width: 100px;
  text-align: center;
  margin-left: -50px;
  border: 1px solid var(--grey-color-8);
  z-index: 1;
}

header .right_header .language .language_dropdown .dropdown_content a {
  color: var(--primary-font-color);
  padding: 4px 8px;
  text-decoration: none;
  display: block;
  opacity: 80%;
}

header .right_header .language .language_dropdown .dropdown_content a:hover {
  background: var(--primary-color-8);
  font-weight: bold;
  opacity: 100%;
}

header .right_header .language .language_dropdown:hover .dropdown_content {
  display: block;
}

header .right_header .language .language_dropdown:hover button span {
  text-decoration: underline;
}

@media (max-width: 1050px) {
  header nav {
    display: none;
  }

  header .left_header .menu_icon {
    display: block;
    cursor: pointer;
    margin-left: 15px;
    font-size: 22px;
  }

  header .left_header .logo {
    margin-left: 12px;
  }
}

@media (max-width: 500px) {
  header .left_header .logo {
    display: none;
  }

  header .right_header .emergency_desktop {
    display: none;
  }

  header .right_header .emergency_mobile {
    display: inherit;
  }
}
</style>
