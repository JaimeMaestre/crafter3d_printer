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
      </div>

      <div>
        <p>
          <strong class="font_underline">List of USB</strong><br />
          <span v-for="(usb, index) in USBlist" :key="index">
            <strong>{{ index + 1 }} - {{ usb.device }}</strong>
          </span>
        </p>
      </div>

      <div class="mt_12 mb_12">
        <button class="btn button_complementary" @click="ServerInfoStore.resetFirmware()">
          <font-awesome-icon :icon="['fas', 'power-off']" class="mr_8" /> Reset Firmware
        </button>
        <router-link to="/edit-file-standard" class="btn button_primary_empty ml_8">
          <font-awesome-icon :icon="['fas', 'pen']" class="mr_8" /> Edit standard cfg
        </router-link>
        <router-link to="/edit-file-45" class="btn button_primary_empty ml_8">
          <font-awesome-icon :icon="['fas', 'pen']" class="mr_8" /> Edit infinite-Z cfg
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGeneralVariablesStore } from '@/stores/useGeneralVariablesStore'
import { useCrafterAPIStore } from '@/stores/useCrafterAPIStore'
import { ref, onMounted } from 'vue'

const GeneralVariablesStore = useGeneralVariablesStore()
const CrafterAPIStore = useCrafterAPIStore()
const USBlist = ref([])

// Methods
async function getchUSBconnections() {
  await CrafterAPIStore.getUSBdevices()
  USBlist.value = CrafterAPIStore.apiResponse
}

onMounted(() => {
  getchUSBconnections()
})
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
