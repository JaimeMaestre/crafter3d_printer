import { defineStore } from 'pinia'
import { useWebsocketStore } from './useWebsocketStore'
import { useModalStore } from './useModalStore'
import { useGeneralVariablesStore } from './useGeneralVariablesStore'

export const useMoonrakerStore = defineStore('moonraker', () => {
  // Imported Variables
  const websocketStore = useWebsocketStore()
  const ModalStore = useModalStore()
  const GeneralVariablesStore = useGeneralVariablesStore()

  /////////////////////////////////
  // Initialize
  /////////////////////////////////
  function initMoonraker() {
    const waitForConnection = new Promise((resolve) => {
      const checkConnection = setInterval(() => {
        if (GeneralVariablesStore.isWebsocketConnected) {
          clearInterval(checkConnection)
          resolve()
        }
      }, 100) // Check every 100ms
    })

    waitForConnection
      .then(() => {
        getServerStatus()
        getPrinterStatus()
        getUSB()
        GeneralVariablesStore.isMoonrakerConnected = true
        console.log('Server Initialized')
      })
      .catch((error) => {
        ModalStore.showErrorModal('Websocket not responding: ' + error.message)
      })
  }

  /////////////////////////////////
  // Handle
  /////////////////////////////////
  function handleMoonrakerStatus(data) {
    GeneralVariablesStore.mcuStatus.klippy = data.klippy_connected || false
    GeneralVariablesStore.mcuStatus.warnnings = data.warnnings || ''
    GeneralVariablesStore.mcuStatus.moonraker_version = data.moonraker_version || ''
  }

  function handlePrinterStatus(data) {
    GeneralVariablesStore.mcuStatus.mcu_state = data.state || 'Unknown'
    GeneralVariablesStore.mcuStatus.status = data.state_message || ''
    GeneralVariablesStore.mcuStatus.hostname = data.hostname || ''
    GeneralVariablesStore.mcuStatus.klipper_version = data.software_version || ''
  }

  function handleListUSB(data) {
    GeneralVariablesStore.systemStats.listUSB.length = 0
    data.forEach((device) => {
      GeneralVariablesStore.systemStats.listUSB.push({
        device_id: device.device_num || 'Unknown',
        product: device.product || 'Unknown',
        manufacturer: device.manufacturer || 'Unknown',
        description: device.description || 'Unknown',
        serial: device.serial || 'Unknown',
      })
    })
  }

  /////////////////////////////////
  // Getters
  /////////////////////////////////
  function getServerStatus() {
    websocketStore
      .sendMessage('server.info')
      .then((response) => {
        handleMoonrakerStatus(response.result)
      })
      .catch((error) => {
        console.log('Error getting Server status: ' + error.message)
      })
  }

  function getPrinterStatus() {
    websocketStore
      .sendMessage('printer.info')
      .then((response) => {
        handlePrinterStatus(response.result)
      })
      .catch((error) => {
        console.log('Error getting Printer status: ' + error.message)
      })
  }

  function getUSB() {
    websocketStore
      .sendMessage('machine.peripherals.usb')
      .then((response) => {
        handleListUSB(response.result.usb_devices)
      })
      .catch((error) => {
        console.log('Error getting USB list: ' + error.message)
      })
  }

  /////////////////////////////////
  // Actions
  /////////////////////////////////
  function emergencyStop() {
    websocketStore.sendMessage('printer.emergency_stop').catch((error) => {
      ModalStore.showErrorModal('Emergency stop failure: ' + error.message)
    })
    window.location.reload()
  }

  function resetFirmware() {
    websocketStore.sendMessage('printer.firmware_restart').catch((error) => {
      ModalStore.showErrorModal('Reset Firmware Failure: ' + error.message)
    })
    window.location.reload()
  }

  // function changePrinterCfg(source, destination) {
  //   websocketStore
  //     .sendMessage('server.files.copy', {
  //       source: source,
  //       dest: destination,
  //     })
  //     .then(() => {
  //       GeneralVariablesStore.printer_config_change_error = false
  //     })
  //     .catch((error) => {
  //       ModalStore.showErrorModal('Failed to set printer.cfg file: ' + error.message)
  //     })
  // }

  return {
    initMoonraker,
    emergencyStop,
    resetFirmware,
  }
})
