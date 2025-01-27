<template>
  <div class="box_content_large mt_32">
    <div class="box_content_header">
      <div>
        <font-awesome-icon :icon="['fas', 'wifi']" class="mr_8" />
        Wifi Settings
      </div>
    </div>
    <div class="box_content_info">
      <div>
        <p>
          <strong class="font_underline">Wifi</strong><br />
          <strong>Wifi:</strong>
          {{ activeWifiConnection || 'Not connected' }}<br />
          <strong>Bandwidth:</strong>
          {{ GeneralVariablesStore.systemStats.network.wlan0.bandwidth.toFixed(1) }} kB/s<br />
          <strong>Received:</strong>
          {{ GeneralVariablesStore.systemStats.network.wlan0.received.toFixed(2) }} MB<br />
          <strong>Transmitted:</strong>
          {{ GeneralVariablesStore.systemStats.network.wlan0.transmitted.toFixed(2) }} MB<br />
        </p>
        <div class="mt_40">
          <div class="d_flex">
            <div><strong class="font_underline">Available Connections</strong><br /></div>
            <div>
              <button class="btn button_primary" @click="reloadNetworks">
                <font-awesome-icon :icon="['fas', 'rotate-right']" class="mr_8" /> Refres
              </button>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>SSID</th>
                <th>Signal</th>
                <th class="hide_mobile_1350">Security</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(network_available, index) in listAvailableNetwork" :key="index">
                <td>{{ network_available.ssid }}</td>
                <td>{{ network_available.signal }}/100</td>
                <td class="hide_mobile_1350">{{ network_available.security }}</td>
                <td>
                  <div class="actions">
                    <button
                      class="btn button_primary"
                      v-if="!listSavedNetworks.includes(network_available.ssid)"
                      @click="
                        ModalStore.showModalAddWifi(
                          network_available.ssid,
                          network_available.security,
                        )
                      "
                    >
                      Add
                    </button>
                    <button
                      class="btn button_red"
                      v-if="listSavedNetworks.includes(network_available.ssid)"
                      @click="ModalStore.showModalForgetWifi(network_available.ssid)"
                    >
                      Forget
                    </button>
                    <button
                      class="btn button_green"
                      v-if="
                        activeWifiConnection != network_available.ssid &&
                        listSavedNetworks.includes(network_available.ssid)
                      "
                    >
                      Connect
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="no_wifi mt_20" v-if="listAvailableNetwork.length == 0">Not wifi's found</div>
        </div>
      </div>
    </div>
  </div>
  <addWifi />
  <forgetWifi />
</template>

<script setup>
import { useGeneralVariablesStore } from '@/stores/useGeneralVariablesStore'
import { useCrafterAPIStore } from '@/stores/useCrafterAPIStore'
import addWifi from '@/components/Modals/addWifi.vue'
import forgetWifi from '@/components/Modals/forgetWifi.vue'
import { useModalStore } from '@/stores/useModalStore'
import { ref, onMounted } from 'vue'

const GeneralVariablesStore = useGeneralVariablesStore()
const ModalStore = useModalStore()
const CrafterAPIStore = useCrafterAPIStore()

// States
const activeWifiConnection = ref(null)
const listSavedNetworks = ref([])
const listAvailableNetwork = ref([])

// Methods
// API functions
async function API_fetchActiveConnection() {
  await CrafterAPIStore.fetchActiveConnection()
  const response = CrafterAPIStore.apiResponse
  if (response && response.activeConnection) {
    activeWifiConnection.value = response.activeConnection
  }
}

// Fetch saved networks
async function API_fetchSavedNetworks() {
  await CrafterAPIStore.fetchSavedConnections()
  listSavedNetworks.value = CrafterAPIStore.apiResponse || []
}

// Fetch available networks
async function API_fetchAvailableNetworks() {
  await CrafterAPIStore.fetchAvailableNetworks()
  listAvailableNetwork.value = CrafterAPIStore.apiResponse || []
}

// // Forget a network
// async function forgetNetwork(ssid) {
//   await CrafterAPIStore.forgetConnection(ssid)
//   API_fetchSavedNetworks()
// }

async function reloadNetworks() {
  listAvailableNetwork.value = []
  await API_fetchSavedNetworks()
  await API_fetchAvailableNetworks()
}

// Lifecycle Hook
onMounted(() => {
  API_fetchActiveConnection()
  API_fetchSavedNetworks()
  API_fetchAvailableNetworks()
})
</script>

<style scoped>
p {
  margin: 0px;
  margin-top: 8px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  justify-content: space-around;
}

.d_flex {
  justify-content: space-between;
}

.no_wifi {
  text-align: center;
}
</style>
