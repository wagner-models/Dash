import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export class AnalyticsService {
  constructor(connection, wallet) {
    this.connection = connection;
    this.wallet = wallet;
  }

  async getDashboardStats() {
    try {
      if (!this.wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      // Get wallet balance
      const balance = await this.connection.getBalance(this.wallet.publicKey);

      // Get NFT stats (mocked for now)
      const nftStats = {
        owned: 5,
        listed: 2,
        sold: 3,
        totalValue: 10.5
      };

      // Get recent activity
      const recentActivity = await this.getRecentActivity();

      return {
        balance: balance / LAMPORTS_PER_SOL,
        nftStats,
        recentActivity
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  async getRecentActivity() {
    // Mock recent activity data
    return [
      {
        type: 'sale',
        nftName: 'Cool NFT #1',
        price: 2.5,
        timestamp: new Date().toISOString()
      },
      // Add more activity items...
    ];
  }
} 