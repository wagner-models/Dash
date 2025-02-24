export class SettingsService {
  constructor() {
    this.storageKey = 'dash_user_settings';
  }

  async getSettings() {
    try {
      const settings = localStorage.getItem(this.storageKey);
      return settings ? JSON.parse(settings) : this.getDefaultSettings();
    } catch (error) {
      console.error('Error getting settings:', error);
      return this.getDefaultSettings();
    }
  }

  async saveSettings(settings) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(settings));
      return settings;
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }

  getDefaultSettings() {
    return {
      theme: 'light',
      currency: 'SOL',
      notifications: {
        sales: true,
        listings: true,
        priceAlerts: true,
        marketUpdates: false
      },
      display: {
        showPriceHistory: true,
        showAttributes: true,
        compactView: false
      },
      privacy: {
        publicProfile: true,
        showCollections: true,
        showActivity: true
      }
    };
  }
} 