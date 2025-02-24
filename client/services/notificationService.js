export class NotificationService {
  constructor() {
    this.permission = null;
    this.subscribers = new Set();
  }

  async initialize() {
    try {
      this.permission = await Notification.requestPermission();
      return this.permission === 'granted';
    } catch (error) {
      console.error('Error initializing notifications:', error);
      return false;
    }
  }

  async sendNotification(title, options = {}) {
    if (this.permission !== 'granted') return;

    try {
      const notification = new Notification(title, {
        icon: '/logo.png',
        ...options
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      this.notifySubscribers('notification', { title, ...options });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  subscribe(callback) {
    this.subscribers.add(callback);
  }

  unsubscribe(callback) {
    this.subscribers.delete(callback);
  }

  notifySubscribers(event, data) {
    this.subscribers.forEach(callback => callback(event, data));
  }
} 