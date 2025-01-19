<template>
  <div v-if="generalVariables.side_menu_visibility" class="modal">
    <div class="side_menu">
      <div class="side_menu_header">
        <h3>{{ $t('sideBar.menu') }}</h3>
        <span @click="toggleSideMenu">X</span>
      </div>

      <ul>
        <router-link to="/" active-class="nav_button_active">{{
          $t('topBar.dashboard')
        }}</router-link>
        <router-link to="/print-files" active-class="nav_button_active">{{
          $t('topBar.printFiles')
        }}</router-link>
        <router-link to="/settings" active-class="nav_button_active">{{
          $t('topBar.settings')
        }}</router-link>
        <a href="https://mito3d.com/" target="_blank">{{ $t('topBar.models') }}</a>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useGeneralVariablesStore } from '@/stores/useGeneralVariablesStore'

// Variables
const generalVariables = useGeneralVariablesStore()

// Methods
const toggleSideMenu = () => {
  generalVariables.side_menu_visibility = !generalVariables.side_menu_visibility
}
</script>

<style scoped>
.side_menu {
  display: block;
  width: 100%;
  background-color: var(--grey-color-12);
  position: fixed;
  left: 0;
  top: 55px;
  z-index: 10;
  border-bottom: 1px solid var(--primary-font-color);
}

.side_menu .side_menu_header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.side_menu .side_menu_header span {
  margin-right: 60px;
  cursor: pointer;
  padding: 20px;
}

.side_menu .side_menu_header span:hover {
  font-weight: bold;
}

.side_menu .side_menu_header h3 {
  padding: 20px;
  margin: 0px;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: center;
}

ul a {
  padding: 15px 30px;
  text-decoration: none;
  color: var(--primary-font-color);
  display: block;
}

ul a:hover,
.nav_button_active {
  background-color: var(--primary-color-9);
  font-weight: bold;
}

@media (max-width: 1050px) {
  .side_menu {
    top: 51px;
  }
}

@media (max-width: 500px) {
  .side_menu {
    top: 47px;
  }
}
</style>
