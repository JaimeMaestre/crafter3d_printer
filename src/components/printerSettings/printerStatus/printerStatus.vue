<template>
  <div class="box_content_large mt_32">
    <div class="box_content_header">
      <div>
        <font-awesome-icon :icon="['fas', 'chalkboard']" class="mr_8" />
        Server Status
      </div>
    </div>

    <div class="box_content_info">
      <div>
        <p>
          <strong class="font_underline">Printer MCU</strong><br />
          <strong>MCU State:</strong>
          {{ GeneralVariablesStore.mcuStatus.mcu_state }}<br />
          <strong>Printer Status:</strong>
          {{ GeneralVariablesStore.mcuStatus.status }}<br />
          <strong>software:</strong>
          {{ GeneralVariablesStore.mcuStatus.software }}<br />
          <strong>Warnnings:</strong>
          {{ GeneralVariablesStore.mcuStatus.warnnings }}<br />
        </p>
        <button class="btn button_primary mt_12 mb_12" @click="ServerInfoStore.resetFirmware()">
          <font-awesome-icon :icon="['fas', 'power-off']" class="mr_8" /> Reset Firmware
        </button>
      </div>
      <div>
        <p>
          <strong class="font_underline">List of USB</strong><br />
          <span v-for="(device, index) in GeneralVariablesStore.listUSB" :key="index">
            <strong>USB {{ device.device_id }}</strong>
            <ul>
              <li>Product: {{ device.product }}</li>
              <li>Manufacturer: {{ device.manufacturer }}</li>
              <li>Serial id: {{ device.serial }}</li>
              <li>Description: {{ device.description }}</li>
            </ul>
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGeneralVariablesStore } from '@/stores/useGeneralVariablesStore'

const GeneralVariablesStore = useGeneralVariablesStore()
</script>

<style scoped>
h3 {
  margin: 0;
  padding: 0;
  border-bottom: 1px solid var(--primary-font-color);
}

p {
  margin: 0px;
  margin-top: 8px;
}
</style>
