import { defineStore } from 'pinia'
import { useWebsocketStore } from './useWebsocketStore'
import { useModalStore } from './useModalStore'
import { useGeneralVariablesStore } from './useGeneralVariablesStore'

export const useGcodeStore = defineStore('gCode', () => {
  // Imported Variables
  const websocketStore = useWebsocketStore()
  const ModalStore = useModalStore()
  const GeneralVariablesStore = useGeneralVariablesStore()

  // Getters
  async function consoleHistory() {
    const loadLines = 50
    const waitForConnection = new Promise((resolve) => {
      const checkConnection = setInterval(() => {
        if (GeneralVariablesStore.isDatabaseLoaded && GeneralVariablesStore.isWebsocketConnected) {
          clearInterval(checkConnection)
          resolve()
        }
      }, 100)
    })

    waitForConnection
      .then(async () => {
        try {
          const response = await websocketStore.sendMessage('server.gcode_store', {
            count: loadLines,
          })

          if (response.result && response.result.gcode_store) {
            // Extract just the G-code commands from the store
            GeneralVariablesStore.gcodeHistory = response.result.gcode_store
              .map((line) => line.message)
              .slice(0, loadLines)
          }
        } catch (error) {
          console.error('Failed to fetch G-code history:', error)
        }
      })
      .catch((error) => {
        ModalStore.showErrorModal('Database is not loading: ' + error.message)
      })
  }

  //Actions Control
  async function setLayerFanSpeed(speed_change) {
    return new Promise((resolve, reject) => {
      const speed = Math.min(255, Math.max(0, speed_change))
      websocketStore
        .sendMessage('printer.gcode.script', {
          script: `M106 S${speed}`,
        })
        .then(() => resolve())
        .catch((error) => {
          ModalStore.showErrorModal('Failed to set Layer Blower fan speed: ' + error.message)
          reject(error)
        })
    })
  }

  async function setAuxBlowerFanSpeed(speed_change) {
    return new Promise((resolve, reject) => {
      const speed = Math.min(255, Math.max(0, speed_change))
      websocketStore
        .sendMessage('printer.gcode.script', {
          script: `M106 P2 S${speed}`,
        })
        .then(() => resolve())
        .catch((error) => {
          ModalStore.showErrorModal('Failed to set Aux Blowers: ' + error.message)
          reject(error)
        })
    })
  }

  async function setBedTemperature(target_temperature) {
    return new Promise((resolve, reject) => {
      if (
        target_temperature === undefined ||
        target_temperature === null ||
        target_temperature === ''
      ) {
        target_temperature = 0
      }
      if (isNaN(target_temperature)) {
        ModalStore.showErrorModal('Invalid bed temperature value: must be a number')
        reject(new Error('Invalid bed temperature value'))
        return
      }
      const maxBedTemp = GeneralVariablesStore.database.motion.default_max_bed_temp.value || 120
      if (target_temperature > maxBedTemp) {
        target_temperature = maxBedTemp
      }
      websocketStore
        .sendMessage('printer.gcode.script', {
          script: `M140 S${target_temperature}`,
        })
        .then(() => {
          if (target_temperature > 0) {
            GeneralVariablesStore.temperatureStatus.bed_status_temp = true
          } else {
            GeneralVariablesStore.temperatureStatus.bed_status_temp = false
          }
          resolve()
        })
        .catch((error) => {
          ModalStore.showErrorModal('Failed to set bed temperature: ' + error.message)
          reject(error)
        })
    })
  }

  async function setHotendTemperature(target_temperature) {
    return new Promise((resolve, reject) => {
      if (
        target_temperature === undefined ||
        target_temperature === null ||
        target_temperature === ''
      ) {
        target_temperature = 0
      }
      if (isNaN(target_temperature)) {
        ModalStore.showErrorModal('Invalid hotend temperature value: must be a number')
        reject(new Error('Invalid hotend temperature value'))
        return
      }
      const maxHotendTemp =
        GeneralVariablesStore.database.motion.default_max_hotend_temp.value || 300
      if (target_temperature > maxHotendTemp) {
        target_temperature = maxHotendTemp
      }
      websocketStore
        .sendMessage('printer.gcode.script', {
          script: `M104 S${target_temperature}`,
        })
        .then(() => {
          GeneralVariablesStore.temperatureStatus.hotend_status_temp = true
          resolve()
        })
        .catch((error) => {
          ModalStore.showErrorModal('Failed to set toolhead temperature: ' + error.message)
          reject(error)
        })
    })
  }

  async function offBedTemperature() {
    return new Promise((resolve, reject) => {
      websocketStore
        .sendMessage('printer.gcode.script', {
          script: `M140 S0`,
        })
        .then(() => {
          GeneralVariablesStore.temperatureStatus.bed_status_temp = false
          resolve()
        })
        .catch((error) => {
          ModalStore.showErrorModal('Failed turn off bed temperature: ' + error.message)
          reject(error)
        })
    })
  }

  async function offHotendTemperature() {
    return new Promise((resolve, reject) => {
      websocketStore
        .sendMessage('printer.gcode.script', {
          script: `M104 S0`,
        })
        .then(() => {
          GeneralVariablesStore.temperatureStatus.hotend_status_temp = false
          resolve()
        })
        .catch((error) => {
          ModalStore.showErrorModal('Failed turn off toolhead temperature: ' + error.message)
          reject(error)
        })
    })
  }

  async function offHeaters() {
    return new Promise((resolve, reject) => {
      websocketStore
        .sendMessage('printer.gcode.script', {
          script: `TURN_OFF_HEATERS`,
        })
        .then(() => resolve())
        .catch((error) => {
          ModalStore.showErrorModal('Failed turn off heaters: ' + error.message)
          reject(error)
        })
    })
  }

  async function setHomeXY() {
    return new Promise((resolve, reject) => {
      websocketStore
        .sendMessage('printer.gcode.script', {
          script: 'G28 X Y',
        })
        .then(() => resolve())
        .catch((error) => {
          ModalStore.showErrorModal('Failed to home X Axes: ' + error.message)
          reject(error)
        })
    })
  }

  async function setHomeFull() {
    return new Promise((resolve, reject) => {
      websocketStore
        .sendMessage('printer.gcode.script', {
          script: 'G28 Z',
        })
        .then(() => resolve())
        .catch((error) => {
          ModalStore.showErrorModal('Error during homing: ' + error.message)
          reject(error)
        })
    })
  }

  async function moveXaxes(
    distance,
    speed = GeneralVariablesStore.database.motion.default_XY_speed.value,
  ) {
    return new Promise((resolve, reject) => {
      const newPosition =
        Math.round(GeneralVariablesStore.controlStatus.current_position[0]) + distance
      const position = Math.min(
        GeneralVariablesStore.controlStatus.max_print_size[0],
        Math.max(0, newPosition),
      )

      websocketStore
        .sendMessage('printer.gcode.script', {
          script: `G0 X${position} F${speed}`,
        })
        .then(() => resolve())
        .catch((error) => {
          ModalStore.showErrorModal('Failed to move X-axis: ' + error.message)
          reject(error)
        })
    })
  }

  async function moveYaxes(
    distance,
    speed = GeneralVariablesStore.database.motion.default_XY_speed.value,
  ) {
    return new Promise((resolve, reject) => {
      const newPosition =
        Math.round(GeneralVariablesStore.controlStatus.current_position[1]) + distance
      const position = Math.min(
        GeneralVariablesStore.controlStatus.max_print_size[1],
        Math.max(0, newPosition),
      )

      websocketStore
        .sendMessage('printer.gcode.script', {
          script: `G0 Y${position} F${speed}`,
        })
        .then(() => resolve())
        .catch((error) => {
          ModalStore.showErrorModal('Failed to move Y-axis: ' + error.message)
          reject(error)
        })
    })
  }

  async function moveZaxes(
    distance,
    speed = GeneralVariablesStore.database.motion.default_Z_speed.value,
  ) {
    return new Promise((resolve, reject) => {
      const newPosition =
        Math.round(GeneralVariablesStore.controlStatus.current_position[2]) + distance
      const position = Math.min(
        GeneralVariablesStore.controlStatus.max_print_size[2],
        Math.max(0, newPosition),
      )

      websocketStore
        .sendMessage('printer.gcode.script', {
          script: `G0 Z${position} F${speed}`,
        })
        .then(() => resolve())
        .catch((error) => {
          ModalStore.showErrorModal('Failed to move Z-axis: ' + error.message)
          reject(error)
        })
    })
  }

  async function moveExtruder(
    distance,
    speed = GeneralVariablesStore.database.motion.default_extruder_speed.value,
  ) {
    return new Promise((resolve, reject) => {
      websocketStore.sendMessage('printer.gcode.script', {
        script: 'G92 E0',
      })

      websocketStore
        .sendMessage('printer.gcode.script', {
          script: `G1 E${distance} F${speed}`,
        })
        .catch((error) => {
          ModalStore.showErrorModal('Failed to move extruder: ' + error.message)
          reject(error)
        })

      websocketStore
        .sendMessage('printer.gcode.script', {
          script: 'G92 E0',
        })
        .then(() => resolve())
    })
  }

  async function moveBelt(
    distance,
    speed = GeneralVariablesStore.database.motion.default_belt_speed.value,
  ) {
    websocketStore
      .sendMessage('printer.gcode.script', {
        script: `MANUAL_STEPPER STEPPER=belt MOVE=${distance} SPEED=${speed}`,
      })
      .then(() => {
        websocketStore
          .sendMessage('printer.gcode.script', {
            script: `MANUAL_STEPPER STEPPER=belt SET_POSITION=0`,
          })
          .catch((error) => {
            ModalStore.showErrorModal('Failed during belt motion: ' + error.message)
          })
      })
      .catch((error) => {
        ModalStore.showErrorModal('Failed to move belt: ' + error.message)
      })
  }

  async function setLED() {
    return new Promise((resolve, reject) => {
      websocketStore
        .sendMessage('printer.gcode.script', {
          script: `TOGGLE_LED`,
        })
        .then(() => resolve())
        .catch((error) => {
          ModalStore.showErrorModal('Failed to toggle LED: ' + error.message)
          reject(error)
        })
    })
  }

  async function zDrop() {
    return new Promise((resolve, reject) => {
      websocketStore
        .sendMessage('printer.gcode.script', {
          script: 'Z_DROP',
        })
        .then(() => resolve())
        .catch((error) => {
          ModalStore.showErrorModal('Failed to move to min Z position: ' + error.message)
          reject(error)
        })
    })
  }

  async function cutFilament() {
    return new Promise((resolve, reject) => {
      websocketStore
        .sendMessage('printer.gcode.script', {
          script: 'CUT_FILAMENT',
        })
        .then(() => resolve())
        .catch((error) => {
          ModalStore.showErrorModal('Failed to move to min Z position: ' + error.message)
          reject(error)
        })
    })
  }

  async function disableMotors() {
    return new Promise((resolve, reject) => {
      websocketStore
        .sendMessage('printer.gcode.script', {
          script: 'M84',
        })
        .then(() => resolve())
        .catch((error) => {
          ModalStore.showErrorModal('Failed to disable motors: ' + error.message)
          reject(error)
        })
    })
  }

  async function beltThrow() {
    return new Promise((resolve, reject) => {
      websocketStore
        .sendMessage('printer.gcode.script', {
          script: 'BELT_THROW',
        })
        .then(() => resolve())
        .catch((error) => {
          ModalStore.showErrorModal('Failed to disable motors: ' + error.message)
          reject(error)
        })
    })
  }

  async function purge() {
    return new Promise((resolve, reject) => {
      websocketStore
        .sendMessage('printer.gcode.script', {
          script: 'PURGE',
        })
        .then(() => resolve())
        .catch((error) => {
          ModalStore.showErrorModal('Failed to disable motors: ' + error.message)
          reject(error)
        })
    })
  }

  async function bedMesh() {
    return new Promise((resolve, reject) => {
      websocketStore
        .sendMessage('printer.gcode.script', {
          script: 'BED_MESH_CALIBRATE',
        })
        .then(() => resolve())
        .catch((error) => {
          ModalStore.showErrorModal('Failed to disable motors: ' + error.message)
          reject(error)
        })
    })
  }

  async function saveConfig() {
    return new Promise((resolve, reject) => {
      websocketStore
        .sendMessage('printer.gcode.script', {
          script: 'SAVE_CONFIG',
        })
        .then(() => resolve())
        .catch((error) => {
          ModalStore.showErrorModal('Failed to disable motors: ' + error.message)
          reject(error)
        })
    })
  }

  async function positiveZoffset() {
    return new Promise((resolve, reject) => {
      const newOffset = GeneralVariablesStore.controlStatus.z_offset + 0.05
      websocketStore
        .sendMessage('printer.gcode.script', {
          script: `SET_GCODE_OFFSET Z=${newOffset} MOVE=1`,
        })
        .then(() => resolve())
        .catch((error) => {
          ModalStore.showErrorModal('Failed to disable motors: ' + error.message)
          reject(error)
        })
    })
  }

  async function negativeZoffset() {
    return new Promise((resolve, reject) => {
      const newOffset = GeneralVariablesStore.controlStatus.z_offset - 0.05
      websocketStore
        .sendMessage('printer.gcode.script', {
          script: `SET_GCODE_OFFSET Z=${newOffset} MOVE=1`,
        })
        .then(() => resolve())
        .catch((error) => {
          ModalStore.showErrorModal('Failed to disable motors: ' + error.message)
          reject(error)
        })
    })
  }

  async function customGcode(gcode) {
    return new Promise((resolve, reject) => {
      websocketStore
        .sendMessage('printer.gcode.script', {
          script: gcode,
        })
        .then(() => {
          consoleHistory()
          resolve()
        })
        .catch((error) => {
          ModalStore.showErrorModal('Failed to execute G-code: ' + error.message)
          reject(error)
        })
    })
  }

  // Calibration functions
  async function zTilt() {
    return new Promise((resolve, reject) => {
      websocketStore
        .sendMessage('printer.gcode.script', {
          script: 'Z_TILT_ADJUST',
        })
        .then(() => resolve())
        .catch((error) => {
          ModalStore.showErrorModal('Failed to execute Z_TILT_ADJUST: ' + error.message)
          reject(error)
        })
    })
  }

  async function probeAccuracy() {
    try {
      // Reset probe results
      ModalStore.probeResults = null
      ModalStore.probeAccuracyModal = true

      await setHomeFull()
      await websocketStore.sendMessage('printer.gcode.script', {
        script: 'PROBE_ACCURACY SPEED=5 SAMPLES=10 SAMPLE_RETRACT_DIST=2',
      })

      // Wait for results
      await new Promise((resolve) => setTimeout(resolve, 15000))
      const response = await websocketStore.sendMessage('server.gcode_store', {
        count: 100,
      })

      // Get results
      if (response.result && response.result.gcode_store) {
        const resultsLine = response.result.gcode_store
          .reverse()
          .find((line) => line.message && line.message.includes('probe accuracy results:'))

        if (resultsLine) {
          const message = resultsLine.message
          const maximum = parseFloat(message.match(/maximum ([\d.-]+)/)[1])
          const minimum = parseFloat(message.match(/minimum ([\d.-]+)/)[1])
          const range = parseFloat(message.match(/range ([\d.-]+)/)[1])
          const average = parseFloat(message.match(/average ([\d.-]+)/)[1])
          const median = parseFloat(message.match(/median ([\d.-]+)/)[1])
          const stddev = parseFloat(message.match(/standard deviation ([\d.-]+)/)[1])
          ModalStore.probeResults = {
            samples: 10,
            mean: average,
            median: median,
            stddev: stddev,
            max: maximum,
            min: minimum,
            range: range,
          }
          ModalStore.probeAccuracyModal = true
        }
      }
    } catch (error) {
      ModalStore.showErrorModal('Failed to complete probe accuracy test: ' + error.message)
    }
  }

  async function bedSensorCalibration(bedPosition) {
    return new Promise((resolve, reject) => {
      websocketStore
        .sendMessage('printer.gcode.script', {
          script: `BED_SENSOR_CALIBRATION BED_POS=${bedPosition}`,
        })
        .then(() => resolve())
        .catch((error) => {
          ModalStore.showErrorModal('Failed to disable motors: ' + error.message)
          reject(error)
        })
    })
  }

  async function beltCalibrationStart() {
    return new Promise((resolve, reject) => {
      websocketStore
        .sendMessage('printer.gcode.script', {
          script: 'BELT_CALIBRATION_START',
        })
        .then(() => resolve())
        .catch((error) => {
          ModalStore.showErrorModal('Failed to disable motors: ' + error.message)
          reject(error)
        })
    })
  }

  async function inputShaper() {
    return new Promise((resolve, reject) => {
      websocketStore
        .sendMessage('printer.gcode.script', {
          script: 'SHAPER_CALIBRATE',
        })
        .then(() => {
          ModalStore.showSuccessModal('Input shaper calibration started')
          resolve()
        })
        .catch((error) => {
          ModalStore.showErrorModal('Failed to disable motors: ' + error.message)
          reject(error)
        })
    })
  }

  async function beltCalibrationStop() {
    return new Promise((resolve, reject) => {
      websocketStore
        .sendMessage('printer.gcode.script', {
          script: 'BELT_CALIBRATION_STOP',
        })
        .then(() => resolve())
        .catch((error) => {
          ModalStore.showErrorModal('Failed to disable motors: ' + error.message)
          reject(error)
        })
    })
  }

  return {
    //getters
    consoleHistory,
    //actions
    setLayerFanSpeed,
    setAuxBlowerFanSpeed,
    setHotendTemperature,
    setBedTemperature,
    offBedTemperature,
    offHotendTemperature,
    offHeaters,
    setHomeXY,
    setHomeFull,
    moveXaxes,
    moveYaxes,
    moveZaxes,
    moveExtruder,
    moveBelt,
    setLED,
    zDrop,
    cutFilament,
    beltThrow,
    beltCalibrationStart,
    beltCalibrationStop,
    disableMotors,
    purge,
    bedMesh,
    saveConfig,
    positiveZoffset,
    negativeZoffset,
    customGcode,
    // Calibration
    zTilt,
    probeAccuracy,
    bedSensorCalibration,
    inputShaper,
  }
})
