import { Connection, PublicKey } from '@solana/web3.js';

export class MonitoringService {
  constructor(connection) {
    this.connection = connection;
    this.metrics = new Map();
    this.alerts = new Set();
    this.subscriptions = new Map();
  }

  async startMonitoring(programId) {
    try {
      // Monitor program metrics
      const subscription = this.connection.onProgramAccountChange(
        new PublicKey(programId),
        (accountInfo) => {
          this.updateMetrics(programId, accountInfo);
        }
      );

      this.subscriptions.set(programId, subscription);

      // Initialize metrics
      const metrics = await this.getProgramMetrics(programId);
      this.metrics.set(programId, metrics);

      return metrics;
    } catch (error) {
      console.error('Monitoring error:', error);
      throw error;
    }
  }

  async getProgramMetrics(programId) {
    const accounts = await this.connection.getProgramAccounts(
      new PublicKey(programId)
    );

    return {
      accountCount: accounts.length,
      totalDataSize: accounts.reduce((sum, acc) => sum + acc.account.data.length, 0),
      lastUpdated: new Date(),
      transactions: await this.getRecentTransactions(programId),
      computeUnits: await this.getComputeUnitUsage(programId)
    };
  }

  async getRecentTransactions(programId) {
    const signatures = await this.connection.getSignaturesForAddress(
      new PublicKey(programId)
    );

    return signatures.map(sig => ({
      signature: sig.signature,
      slot: sig.slot,
      timestamp: sig.blockTime,
      error: sig.err
    }));
  }

  async getComputeUnitUsage(programId) {
    // Implementation for tracking compute unit usage
    return {
      average: 0,
      peak: 0,
      total: 0
    };
  }

  setAlert(condition, callback) {
    const alert = {
      id: Date.now().toString(),
      condition,
      callback
    };
    this.alerts.add(alert);
    return alert.id;
  }

  removeAlert(id) {
    this.alerts = new Set(
      Array.from(this.alerts).filter(alert => alert.id !== id)
    );
  }

  stopMonitoring(programId) {
    const subscription = this.subscriptions.get(programId);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(programId);
    }
  }
} 