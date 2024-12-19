import { defineStore } from 'pinia';
import { reactive, watch } from 'vue';
import { useWebsocketStore } from './useWebsocket.js';

export const usePrinterStore = defineStore('printer', () => {
  // Access WebSocket store
  const websocketStore = useWebsocketStore();

  // Printer Status
  const printerStatus = reactive({
    status: null,
    printingFile: null,
    speed: null,
    flow: null,
    filamentUsed: null,
    layer: null,
    estimatedPrintTime: null,
    totalPrintTime: null,
    speedFactor: null,
    jobQueue: [],
    progress: null,
  });

  // Printer Variables
  const printerVariables = reactive({
    bed_temp: -30,
    extruder_temp: -30,
    historicalTemperatures: [],
    currentTemperatures: {},
    toolheadPosition: { x: 0, y: 0, z: 0 },
    currentZOffset: 0,
    fanSpeeds: {},
  });

  // Subscribe to printer info
  function subscribeToPrinterInfo() {
    // Wait until the WebSocket is connected
    const waitForConnection = new Promise((resolve) => {
      const checkConnection = setInterval(() => {
        if (websocketStore.isConnected) {
          clearInterval(checkConnection);
          resolve();
        }
      }, 100); // Check every 100ms
    });

    waitForConnection
      .then(() => {
        websocketStore
          .sendMessage('printer.objects.subscribe', {
            objects: {
              // Status-related information
              print_stats: ['state', 'filename', 'total_duration', 'print_duration', 'filament_used'],
              gcode_move: ['speed_factor', 'extrude_factor', 'position', 'gcode_position', 'homing_origin'],
              virtual_sdcard: ['progress'],
              queue: ['queued_jobs'],
              heater_bed: ['temperature', 'target'],
              extruder: ['temperature', 'target'],
              toolhead: ['position', 'z_offset'],
              fan: ['speed'],
            },
          })
          .then((response) => {
            console.log('Subscribed to printer info:', response);
          })
          .catch((error) => {
            console.error('Error subscribing to printer info:', error);
          });
      })
      .catch((error) => {
        console.error('Error waiting for WebSocket connection:', error);
      });
  }

  // Handle incoming printer data
  function handlePrinterData(data) {
    const { print_stats, gcode_move, virtual_sdcard, queue, heater_bed, extruder, toolhead, fan } = data;

    // Update printer status
    if (print_stats) {
      printerStatus.status = print_stats.state;
      printerStatus.printingFile = print_stats.filename;
      printerStatus.filamentUsed = print_stats.filament_used;
      printerStatus.totalPrintTime = print_stats.total_duration;
      printerStatus.estimatedPrintTime = print_stats.print_duration;
    }

    if (gcode_move) {
      printerStatus.speedFactor = gcode_move.speed_factor;
      printerStatus.flow = gcode_move.extrude_factor;
      printerVariables.toolheadPosition = gcode_move.position;
      printerVariables.currentZOffset = gcode_move.z_offset;
    }

    if (virtual_sdcard) {
      printerStatus.progress = virtual_sdcard.progress;
    }

    if (queue) {
      printerStatus.jobQueue = queue.queued_jobs;
    }

    // Update printer variables
    if (heater_bed) {
      printerVariables.bed_temp = heater_bed.temperature;
    }

    if (extruder) {
      printerVariables.extruder_temp = extruder.temperature;
    }

    if (toolhead) {
      printerVariables.toolheadPosition = toolhead.position;
      printerVariables.currentZOffset = toolhead.z_offset;
    }

    if (fan) {
      printerVariables.fanSpeeds = fan.speed;
    }
  }

  // Watch for messages from WebSocket
  watch(
    () => websocketStore.messages, // Reactively watch WebSocket messages
    (newMessages) => {
      for (const message of newMessages) {
        if (message.method === 'notify_status_update') {
          handlePrinterData(message.params[0]);
        }
      }

      // Clear processed messages
      websocketStore.messages.splice(0, newMessages.length);
    },
    { deep: true }
  );

  return {
    printerStatus,
    printerVariables,
    subscribeToPrinterInfo,
  };
});
