import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { useGeneralVariablesStore } from './useGeneralVariablesStore'
import { usePrinterStore } from './usePrinterStore'
import { useModalStore } from './useModalStore'

export const useWebsocketStore = defineStore('websocket', () => {
  const GeneralVariablesStore = useGeneralVariablesStore()
  const PrinterStore = usePrinterStore()
  const ModalStore = useModalStore()
  /////////////////////////////////
  // Variables
  /////////////////////////////////
  const socket = ref(null)
  const pendingRequests = reactive({})
  const reconnectInterval = 5000
  let requestId = 0

  /////////////////////////////////
  // Handle
  /////////////////////////////////
  function handleSystemStatus(data) {
    const { cpu_temp, moonraker_stats, system_memory, network, websocket_connections } = data

    GeneralVariablesStore.systemStats.cpuTemp = cpu_temp
    GeneralVariablesStore.systemStats.cpuUsage = moonraker_stats?.cpu_usage || 0
    GeneralVariablesStore.systemStats.memoryUsage.total = system_memory?.total || 0
    GeneralVariablesStore.systemStats.memoryUsage.available = system_memory?.available || 0
    GeneralVariablesStore.systemStats.memoryUsage.used = system_memory?.used || 0
    const wlan0 = network?.wlan0
    if (wlan0) {
      GeneralVariablesStore.systemStats.network.wlan0.bandwidth = wlan0.bandwidth || 0
      GeneralVariablesStore.systemStats.network.wlan0.received = wlan0.received || 0
      GeneralVariablesStore.systemStats.network.wlan0.transmitted = wlan0.transmitted || 0
    }
    GeneralVariablesStore.systemStats.websocketConnections = websocket_connections || 0
  }

  function handleWebSocketMessage(event) {
    try {
      const data = JSON.parse(event.data)

      if (data.id && pendingRequests[data.id]) {
        pendingRequests[data.id](data)
        delete pendingRequests[data.id]
      } else {
        GeneralVariablesStore.WebsockeMessages.unshift(data)
        if (GeneralVariablesStore.WebsockeMessages.length > 5) {
          GeneralVariablesStore.WebsockeMessages.splice(5)
        }

        //message cases
        if (data.method === 'notify_status_update') {
          PrinterStore.handlePrinterData(data.params[0])
        } else if (data.method === 'notify_proc_stat_update') {
          handleSystemStatus(data.params[0])
        }
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  /////////////////////////////////
  // Actions
  /////////////////////////////////
  function connectWebSocket() {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      console.warn('WebSocket already connected')
      return
    }
    socket.value = new WebSocket('ws://' + GeneralVariablesStore.hostname + '/websocket')
    socket.value.onopen = () => {
      GeneralVariablesStore.isWebsocketConnected = true
      console.log('WebSocket connected')
    }

    socket.value.onmessage = handleWebSocketMessage

    socket.value.onclose = () => {
      console.log('WebSocket disconnected, attempting to reconnect...')
      GeneralVariablesStore.isWebsocketConnected = false
      setTimeout(() => connectWebSocket(), reconnectInterval)
    }

    socket.value.onerror = (error) => {
      console.error('WebSocket error: ' + error.message)
    }
  }

  function sendMessage(method, params = {}, responseTimeout = false) {
    if (GeneralVariablesStore.isWebsocketConnected && socket.value.readyState === WebSocket.OPEN) {
      requestId += 1

      const payload = {
        jsonrpc: '2.0',
        method,
        params,
        id: requestId,
      }
      socket.value.send(JSON.stringify(payload))

      return new Promise((resolve, reject) => {
        pendingRequests[requestId] = (response) => {
          if (response.error) {
            reject(new Error(response.error.message || 'Unknown error'))
          } else {
            resolve(response)
          }
        }

        if (responseTimeout) {
          setTimeout(() => {
            if (pendingRequests[requestId]) {
              reject(new Error(`Request ${requestId} timed out`))
              delete pendingRequests[requestId]
            }
          }, 30000)
        }
      })
    } else {
      GeneralVariablesStore.isWebsocketConnected = false
      ModalStore.showErrorModal('Cannot send message: WebSocket is not connected')
      return Promise.reject(new Error('WebSocket is not connected'))
    }
  }

  function disconnectWebSocket() {
    if (socket.value) {
      GeneralVariablesStore.isWebsocketConnected = false
      socket.value.close()
    }
  }

  return {
    connectWebSocket,
    sendMessage,
    disconnectWebSocket,
  }
})
