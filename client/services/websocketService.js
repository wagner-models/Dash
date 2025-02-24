export class WebSocketService {
  constructor(connection, wallet) {
    this.connection = connection;
    this.wallet = wallet;
    this.subscribers = new Map();
    this.ws = null;
  }

  connect() {
    // Using Solana's WebSocket endpoint
    this.ws = new WebSocket('wss://api.mainnet-beta.solana.com');

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.subscribeToAccountChanges();
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      // Attempt to reconnect after a delay
      setTimeout(() => this.connect(), 5000);
    };
  }

  subscribeToAccountChanges() {
    if (this.wallet.publicKey) {
      const subscribeMessage = {
        jsonrpc: '2.0',
        id: 1,
        method: 'accountSubscribe',
        params: [
          this.wallet.publicKey.toString(),
          {
            encoding: 'jsonParsed',
            commitment: 'confirmed'
          }
        ]
      };

      this.ws.send(JSON.stringify(subscribeMessage));
    }
  }

  subscribe(event, callback) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set());
    }
    this.subscribers.get(event).add(callback);
  }

  unsubscribe(event, callback) {
    if (this.subscribers.has(event)) {
      this.subscribers.get(event).delete(callback);
    }
  }

  handleMessage(data) {
    // Handle different types of messages
    if (data.method === 'accountNotification') {
      const accountInfo = data.params.result;
      this.notifySubscribers('accountUpdate', accountInfo);
    }
  }

  notifySubscribers(event, data) {
    if (this.subscribers.has(event)) {
      this.subscribers.get(event).forEach(callback => callback(data));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
} 