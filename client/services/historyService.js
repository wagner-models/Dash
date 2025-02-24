import { Connection, PublicKey } from '@solana/web3.js';

export class HistoryService {
  constructor(connection, wallet) {
    this.connection = connection;
    this.wallet = wallet;
  }

  async getTransactionHistory() {
    try {
      if (!this.wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      const signatures = await this.connection.getSignaturesForAddress(
        this.wallet.publicKey,
        { limit: 50 }
      );

      const transactions = await Promise.all(
        signatures.map(async (sig) => {
          const tx = await this.connection.getTransaction(sig.signature);
          return {
            signature: sig.signature,
            timestamp: sig.blockTime ? new Date(sig.blockTime * 1000) : new Date(),
            status: sig.confirmationStatus,
            type: this.getTransactionType(tx),
            amount: this.getTransactionAmount(tx),
          };
        })
      );

      return transactions;
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw error;
    }
  }

  getTransactionType(transaction) {
    // Simplified type detection - expand based on your needs
    if (!transaction) return 'unknown';
    if (transaction.meta?.innerInstructions?.length > 0) return 'nft';
    return 'transfer';
  }

  getTransactionAmount(transaction) {
    if (!transaction?.meta?.postBalances || !transaction?.meta?.preBalances) {
      return 0;
    }
    
    const preBalance = transaction.meta.preBalances[0];
    const postBalance = transaction.meta.postBalances[0];
    return Math.abs(postBalance - preBalance) / LAMPORTS_PER_SOL;
  }
} 