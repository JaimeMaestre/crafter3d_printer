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
  function setLayerFanSpeed(speed_change) {
    // Ensure the fan value stays within 0–1
    const speed = Math.min(1, Math.max(0, speed_change))

    websocketStore
      .sendMessage('printer.gcode.script', {
        script: `SET_FAN_SPEED FAN=layer_blower SPEED=${speed}`,
      })
      .catch((error) => {
        ModalStore.showErrorModal('Failed to set Layer Blower fan speed: ' + error.message)
      })
  }

  function setAuxBlowerFanSpeed(speed_change) {
    // Ensure the fan value stays within 0–1
    const speed = Math.min(1, Math.max(0, speed_change))

    websocketStore
      .sendMessage('printer.gcode.script', {
        script: `SET_FAN_SPEED FAN=aux_blower_1 SPEED=${speed}`,
      })
      .catch((error) => {
        ModalStore.showErrorModal('Failed to set Aux Blower 1: ' + error.message)
      })
    websocketStore
      .sendMessage('printer.gcode.script', {
        script: `SET_FAN_SPEED FAN=aux_blower_2 SPEED=${speed}`,
      })
      .catch((error) => {
        ModalStore.showErrorModal('Failed to set Aux Blower 2: ' + error.message)
      })
    websocketStore
      .sendMessage('printer.gcode.script', {
        script: `SET_FAN_SPEED FAN=aux_blower_3 SPEED=${speed}`,
      })
      .catch((error) => {
        ModalStore.showErrorModal('Failed to set Aux Blower 3: ' + error.message)
      })
  }

  function setBedTemperature(target_temperature) {
    const maxBedTemp = GeneralVariablesStore.database.motion.default_max_bed_temp.value || 120
    if (target_temperature > maxBedTemp) {
      target_temperature = maxBedTemp
    }
    websocketStore
      .sendMessage('printer.gcode.script', {
        script: `SET_HEATER_TEMPERATURE HEATER=heater_bed TARGET=${target_temperature}`,
      })
      .then(() => {
        if (target_temperature > 0) {
          GeneralVariablesStore.temperatureStatus.bed_status_temp = true
        } else {
          GeneralVariablesStore.temperatureStatus.bed_status_temp = false
        }
      })
      .catch((error) => {
        ModalStore.showErrorModal('Failed to set bed temperature: ' + error.message)
      })
  }

  function setHotendTemperature(target_temperature) {
    const maxHotendTemp = GeneralVariablesStore.database.motion.default_max_hotend_temp.value || 350
    if (target_temperature > maxHotendTemp) {
      target_temperature = maxHotendTemp
    }
    websocketStore
      .sendMessage('printer.gcode.script', {
        script: `SET_HEATER_TEMPERATURE HEATER=extruder TARGET=${target_temperature}`,
      })
      .then(() => {
        GeneralVariablesStore.temperatureStatus.hotend_status_temp = true
      })
      .catch((error) => {
        ModalStore.showErrorModal('Failed to set toolhead temperature: ' + error.message)
      })
  }

  function offBedTemperature() {
    websocketStore
      .sendMessage('printer.gcode.script', {
        script: `SET_HEATER_TEMPERATURE HEATER=heater_bed TARGET=0`,
      })
      .then(() => {
        GeneralVariablesStore.temperatureStatus.bed_status_temp = false
      })
      .catch((error) => {
        ModalStore.showErrorModal('Failed turn off bed temperature: ' + error.message)
      })
  }

  function offHotendTemperature() {
    websocketStore
      .sendMessage('printer.gcode.script', {
        script: `SET_HEATER_TEMPERATURE HEATER=extruder TARGET=0`,
      })
      .then(() => {
        GeneralVariablesStore.temperatureStatus.hotend_status_temp = false
      })
      .catch((error) => {
        ModalStore.showErrorModal('Failed turn off toolhead temperature: ' + error.message)
      })
  }

  function offHeaters() {
    websocketStore
      .sendMessage('printer.gcode.script', {
        script: `TURN_OFF_HEATERS`,
      })
      .catch((error) => {
        ModalStore.showErrorModal('Failed turn off heaters: ' + error.message)
      })
  }

  function setAbsoluteAxes() {
    return new Promise((resolve, reject) => {
      websocketStore
        .sendMessage('printer.gcode.script', {
          script: `G90`,
        })
        .then(() => resolve())
        .catch((error) => {
          console.error('Failed set absolute axes position: ' + error.message)
          reject(error)
        })
    })
  }

  function setRelativeAxes() {
    return new Promise((resolve, reject) => {
      websocketStore
        .sendMessage('printer.gcode.script', {
          script: `G91`,
        })
        .then(() => resolve())
        .catch((error) => {
          console.error('Failed set relative axes position: ' + error.message)
          reject(error)
        })
    })
  }

  function setHomeXY() {
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

  function setHomeFull() {
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

  function moveXaxes(
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

  function moveYaxes(
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

  function moveZaxes(
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

  function moveExtruder(
    distance,
    speed = GeneralVariablesStore.database.motion.default_extruder_speed.value,
  ) {
    return new Promise((resolve, reject) => {
      const newExtruderPosition =
        Math.round(GeneralVariablesStore.controlStatus.current_position[3]) + distance

      websocketStore
        .sendMessage('printer.gcode.script', {
          script: `G1 E${newExtruderPosition} F${speed}`,
        })
        .then(() => resolve())
        .catch((error) => {
          ModalStore.showErrorModal('Failed to move extruder: ' + error.message)
          reject(error)
        })
    })
  }

  function moveBelt(
    distance,
    speed = GeneralVariablesStore.database.motion.default_belt_speed.value,
  ) {
    return new Promise((resolve, reject) => {
      websocketStore
        .sendMessage('printer.gcode.script', {
          script: `MANUAL_STEPPER STEPPER=belt MOVE=${distance} SPEED=${speed}`,
        })
        .then(() => {
          websocketStore
            .sendMessage('printer.gcode.script', {
              script: `MANUAL_STEPPER STEPPER=belt SET_POSITION=0`,
            })
            .then(() => resolve())
            .catch((error) => {
              ModalStore.showErrorModal('Failed during belt motion: ' + error.message)
              reject(error)
            })
        })
        .catch((error) => {
          ModalStore.showErrorModal('Failed to move belt: ' + error.message)
          reject(error)
        })
    })
  }

  function setLED() {
    console.log('LED someone puls me')
    websocketStore
      .sendMessage('printer.gcode.script', {
        script: `TOGGLE_LED`,
      })
      .then(() => {
        // Optionally update the local UI state if you read back the value elsewhere
      })
      .catch((error) => {
        ModalStore.showErrorModal('Failed to toggle LED: ' + error.message)
      })
  }

  function startLED() {
    websocketStore
      .sendMessage('printer.gcode.script', {
        script: `STARTUP_LED`,
      })
      .then(() => {
        // Optionally update the local UI state if you read back the value elsewhere
      })
      .catch((error) => {
        ModalStore.showErrorModal('Failed to toggle LED: ' + error.message)
      })
  }

  function minZposition() {
    const speed = GeneralVariablesStore.database.motion.default_Z_speed.value
    const position = GeneralVariablesStore.controlStatus.max_print_size[2]

    websocketStore
      .sendMessage('printer.gcode.script', {
        script: `G0 Z${position} F${speed}`,
      })
      .catch((error) => {
        ModalStore.showErrorModal('Failed to move to min Z position: ' + error.message)
      })
  }

  function cutFilament() {
    websocketStore
      .sendMessage('printer.gcode.script', {
        script: 'CUT_FILAMENT',
      })
      .catch((error) => {
        ModalStore.showErrorModal('Failed to move to min Z position: ' + error.message)
      })
  }

  function disableMotors() {
    websocketStore
      .sendMessage('printer.gcode.script', {
        script: 'M84',
      })
      .catch((error) => {
        ModalStore.showErrorModal('Failed to disable motors: ' + error.message)
      })
  }

  function beltThrow() {
    websocketStore
      .sendMessage('printer.gcode.script', {
        script: 'BELT_THROW',
      })
      .catch((error) => {
        ModalStore.showErrorModal('Failed to disable motors: ' + error.message)
      })
  }

  function customGcode(gcode) {
    websocketStore
      .sendMessage('printer.gcode.script', {
        script: gcode,
      })
      .catch((error) => {
        ModalStore.showErrorModal('Failed to execute G-code: ' + error.message)
      })
    consoleHistory()
  }

  // Calibration functions
  function zTilt() {
    websocketStore
      .sendMessage('printer.gcode.script', {
        script: 'Z_TILT_ADJUST',
      })
      .catch((error) => {
        ModalStore.showErrorModal('Failed to execute Z_TILT_ADJUST: ' + error.message)
      })
  }

  async function probeAccuracy() {
    try {
      // Reset probe results
      GeneralVariablesStore.probeResults = null
      GeneralVariablesStore.probeAccuracyModalVisible = true

      await setHomeFull()

      // Run PROBE_ACCURACY
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
          GeneralVariablesStore.probeAccuracyModalVisible = true
          GeneralVariablesStore.probeResults = {
            samples: 10,
            mean: average,
            median: median,
            stddev: stddev,
            max: maximum,
            min: minimum,
            range: range,
          }
        }
      }
    } catch (error) {
      ModalStore.showErrorModal('Failed to complete probe accuracy test: ' + error.message)
    }
  }

  function bedSensorCalibration() {
    websocketStore
      .sendMessage('printer.gcode.script', {
        script: 'BED_SENSOR_CALIBRATION',
      })
      .catch((error) => {
        ModalStore.showErrorModal('Failed to disable motors: ' + error.message)
      })
  }

  function beltCalibrationStart() {
    websocketStore
      .sendMessage('printer.gcode.script', {
        script: 'BELT_CALIBRATION_START',
      })
      .catch((error) => {
        ModalStore.showErrorModal('Failed to disable motors: ' + error.message)
      })
  }

  function beltCalibrationStop() {
    websocketStore
      .sendMessage('printer.gcode.script', {
        script: 'BELT_CALIBRATION_STOP',
      })
      .catch((error) => {
        ModalStore.showErrorModal('Failed to disable motors: ' + error.message)
      })
  }

  return {
    //getters
    consoleHistory,
    //actions
    setAbsoluteAxes,
    setRelativeAxes,
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
    startLED,
    setLED,
    minZposition,
    cutFilament,
    beltThrow,
    beltCalibrationStart,
    beltCalibrationStop,
    disableMotors,
    customGcode,
    // Calibration
    zTilt,
    probeAccuracy,
    bedSensorCalibration,
  }
})
