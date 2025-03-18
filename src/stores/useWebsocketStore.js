import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { useGeneralVariablesStore } from './useGeneralVariablesStore'
import { usePrinterStore } from './usePrinterStore'
import { useModalStore } from './useModalStore'

export const useWebsocketStore = defineStore('websocket', () => {
  const GeneralVariablesStore = useGeneralVariablesStore()
  const PrinterStore = usePrinterStore()
  const ModalStore = useModalStore()

  // Variables
  const socket = ref(null)
  const pendingRequests = reactive({})
  const reconnectInterval = 5000
  let requestId = 0

  //getters
  function handleServerUpdate(data) {
    const { cpu_temp, moonraker_stats, system_memory, network, websocket_connections } = data

    // Update CPU temperature
    GeneralVariablesStore.systemStats.cpuTemp = cpu_temp

    // Update CPU usage
    GeneralVariablesStore.systemStats.cpuUsage = moonraker_stats?.cpu_usage || 0

    // Update Memory usage
    GeneralVariablesStore.systemStats.memoryUsage.total = system_memory?.total || 0
    GeneralVariablesStore.systemStats.memoryUsage.available = system_memory?.available || 0
    GeneralVariablesStore.systemStats.memoryUsage.used = system_memory?.used || 0

    // Update Network stats for wlan0
    const wlan0 = network?.wlan0
    if (wlan0) {
      GeneralVariablesStore.systemStats.network.wlan0.bandwidth = wlan0.bandwidth || 0
      GeneralVariablesStore.systemStats.network.wlan0.received = wlan0.received || 0
      GeneralVariablesStore.systemStats.network.wlan0.transmitted = wlan0.transmitted || 0
    }

    // Update WebSocket connections
    GeneralVariablesStore.systemStats.websocketConnections = websocket_connections || 0
  }

  //actions
  function connectWebSocket() {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      console.warn('WebSocket already connected')
      return
    }
    socket.value = new WebSocket('ws://' + GeneralVariablesStore.hostname + '/websocket')

    // On Connection Open
    socket.value.onopen = () => {
      GeneralVariablesStore.isWebsocketConnected = true
      console.log('WebSocket connected')
    }

    // On Message Received
    socket.value.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        // Handle JSON-RPC responses
        if (data.id && pendingRequests[data.id]) {
          pendingRequests[data.id](data)
          console.log('WebSocket response:', data)
          delete pendingRequests[data.id]
        } else {
          // keep only the latest 5
          GeneralVariablesStore.WebsockeMmessages.unshift(data)
          if (GeneralVariablesStore.WebsockeMmessages.length > 5) {
            GeneralVariablesStore.WebsockeMmessages.splice(5)
          }

          //message cases
          if (data.method === 'notify_status_update') {
            PrinterStore.handlePrinterData(data.params[0])
          } else if (data.method === 'notify_proc_stat_update') {
            handleServerUpdate(data.params[0])
          }
        }
      } catch (error) {
        console.error(error.message)
      }
    }

    socket.value.onclose = () => {
      console.log('WebSocket disconnected, attempting to reconnect...')
      GeneralVariablesStore.isWebsocketConnected = false
      setTimeout(() => connectWebSocket(), reconnectInterval)
    }

    socket.value.onerror = (error) => {
      console.error('WebSocket error: ' + error.message)
    }
  }

  // Action to send JSON-RPC 2.0 messages
  function sendMessage(method, params = {}) {
    if (GeneralVariablesStore.isWebsocketConnected && socket.value.readyState === WebSocket.OPEN) {
      // Increment the request ID for each message
      requestId += 1

      // Construct the JSON-RPC 2.0 payload
      const payload = {
        jsonrpc: '2.0',
        method,
        params,
        id: requestId,
      }
      socket.value.send(JSON.stringify(payload))

      // Return a promise for the request
      return new Promise((resolve, reject) => {
        pendingRequests[requestId] = resolve

        // setTimeout(() => {
        //   if (pendingRequests[requestId]) {
        //     reject(new Error(`Request ${requestId} timed out`))
        //     delete pendingRequests[requestId]
        //   }
        // }, 30000)
      })
    } else {
      ModalStore.showErrorModal('Cannot send message: WebSocket is not connected')
      return Promise.reject(new Error('WebSocket is not connected'))
    }
  }

  // Action to disconnect WebSocket
  function disconnectWebSocket() {
    if (socket.value) {
      socket.value.close()
    }
  }

  return {
    connectWebSocket,
    sendMessage,
    disconnectWebSocket,
  }
})
