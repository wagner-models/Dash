export class AnalyticsTrackingService {
  constructor() {
    this.events = [];
    this.initialized = false;
  }

  initialize() {
    if (this.initialized) return;
    
    // Initialize analytics tracking
    window.dataLayer = window.dataLayer || [];
    this.initialized = true;
  }

  trackEvent(category, action, label = null, value = null) {
    if (!this.initialized) this.initialize();

    const event = {
      event: 'custom_event',
      category,
      action,
      label,
      value,
      timestamp: new Date().toISOString()
    };

    this.events.push(event);
    window.dataLayer.push(event);
  }

  trackPageView(page) {
    this.trackEvent('navigation', 'page_view', page);
  }

  trackTransaction(transaction) {
    this.trackEvent('marketplace', 'transaction', null, transaction.amount);
  }

  trackUserAction(action, details) {
    this.trackEvent('user', action, JSON.stringify(details));
  }

  getEventHistory() {
    return this.events;
  }
} 