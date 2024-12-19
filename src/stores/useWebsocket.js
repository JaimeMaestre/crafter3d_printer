import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';

export const useWebsocketStore = defineStore('websocket', () => {
  // State
  const socket = ref(null);
  const isConnected = ref(false);
  const messages = reactive([]); // Array to hold received messages
  const pendingRequests = reactive({}); // To track requests by ID
  const reconnectInterval = 5000; // Time to attempt reconnection
  let requestId = 0; // Unique ID for JSON-RPC requests

  // Action to connect WebSocket
  function connectWebSocket() {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      console.warn('WebSocket already connected');
      return;
    }

    socket.value = new WebSocket('ws://crafter3d.local:7125/websocket');

    // On Connection Open
    socket.value.onopen = () => {
      console.log('WebSocket connected');
      isConnected.value = true;
    };

    // On Message Received
    socket.value.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        //console.log('Message received:', data);
        //if (data.method === 'notify_status_update') {
        //  console.log('Message received:', data);
        //}

        // Handle JSON-RPC responses
        if (data.id && pendingRequests[data.id]) {
          // Resolve the corresponding request
          pendingRequests[data.id](data);
          delete pendingRequests[data.id];
        } else {
          // Handle other incoming messages
          messages.push(data);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    // On Connection Close
    socket.value.onclose = () => {
      console.warn('WebSocket disconnected, attempting to reconnect...');
      isConnected.value = false;
      setTimeout(() => connectWebSocket(), reconnectInterval);
    };

    // On Connection Error
    socket.value.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  // Action to send JSON-RPC 2.0 messages
  function sendMessage(method, params = {}) {
    if (isConnected.value && socket.value.readyState === WebSocket.OPEN) {
      // Increment the request ID for each message
      requestId += 1;

      // Construct the JSON-RPC 2.0 payload
      const payload = {
        jsonrpc: '2.0',
        method,
        params,
        id: requestId,
      };

      console.log('Sending JSON-RPC message:', payload);
      socket.value.send(JSON.stringify(payload));

      // Return a promise for the request
      return new Promise((resolve, reject) => {
        pendingRequests[requestId] = resolve;

        // Optionally add a timeout for the response
        setTimeout(() => {
          if (pendingRequests[requestId]) {
            reject(new Error(`Request ${requestId} timed out`));
            delete pendingRequests[requestId];
          }
        }, 10000); // 10 seconds timeout
      });
    } else {
      console.warn('Cannot send message: WebSocket is not connected');
      return Promise.reject(new Error('WebSocket is not connected'));
    }
  }

  // Action to disconnect WebSocket
  function disconnectWebSocket() {
    if (socket.value) {
      socket.value.close();
    }
  }

  return {
    isConnected,
    messages,
    connectWebSocket,
    sendMessage,
    disconnectWebSocket,
  };
});
