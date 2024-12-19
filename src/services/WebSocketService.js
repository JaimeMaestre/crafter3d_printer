import { reactive,ref } from 'vue';

class WebSocketService {
  constructor(url) {
    this.url = url;
    this.socket = null;
    this.events = reactive([]); // List of incoming events
    this.pendingRequests = {}; // Track pending requests by ID
    this.isConnected = ref(false);
    this.requestId = 0; // Unique ID for JSON-RPC requests
    this.reconnectInterval = 5000; // Reconnection interval in ms
  }

  connect() {
    if (this.socket?.readyState === WebSocket.OPEN) {
      console.warn('WebSocket already connected');
      return;
    }

    console.log(`Connecting to WebSocket at ${this.url}`);
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.isConnected.value = true;
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Message received:', data);

      if (data.id && this.pendingRequests[data.id]) {
        // Resolve the pending request
        this.pendingRequests[data.id](data);
        delete this.pendingRequests[data.id];
      } else {
        // Push general events
        this.events.push(data);
      }
    };

    this.socket.onclose = () => {
      console.warn('WebSocket disconnected, attempting to reconnect...');
      this.isConnected.value = false;
      setTimeout(() => this.connect(), this.reconnectInterval);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  sendMessage = (method, params = {}) => {
    if (!this.isConnected.value || this.socket.readyState !== WebSocket.OPEN) {
      console.warn('Cannot send message: WebSocket is not connected');
      return Promise.reject(new Error('WebSocket is not connected'));
    }

    this.requestId += 1;
    const payload = { jsonrpc: '2.0', method, params, id: this.requestId };
    console.log('Sending JSON-RPC message:', payload);
    this.socket.send(JSON.stringify(payload));

    return new Promise((resolve, reject) => {
      this.pendingRequests[this.requestId] = resolve;

      setTimeout(() => {
        if (this.pendingRequests[this.requestId]) {
          reject(new Error(`Request ${this.requestId} timed out`));
          delete this.pendingRequests[this.requestId];
        }
      }, 10000);
    });
  };
}

export const WebSocketServiceInstance = new WebSocketService('ws://crafter3d.local:7125/websocket');
