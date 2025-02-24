import { 
  Connection, 
  PublicKey, 
  Transaction,
  LAMPORTS_PER_SOL 
} from '@solana/web3.js';
import { TransactionService } from './transactionService';

export class MarketplaceService {
  constructor(connection, wallet) {
    this.connection = connection;
    this.wallet = wallet;
    this.transactionService = new TransactionService(connection, wallet);
  }

  async listNFT(nft, price) {
    try {
      if (!this.wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      // Create and send listing transaction
      const transaction = await this.transactionService.createListingTransaction(nft.mint, price);
      const signature = await this.wallet.sendTransaction(transaction, this.connection);
      await this.connection.confirmTransaction(signature, 'confirmed');

      const listing = {
        id: signature,
        nft,
        price,
        seller: this.wallet.publicKey.toString(),
        createdAt: new Date().toISOString()
      };

      return listing;
    } catch (error) {
      console.error('Error listing NFT:', error);
      throw error;
    }
  }

  async buyNFT(listing) {
    try {
      if (!this.wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      // Create and send purchase transaction
      const transaction = await this.transactionService.createPurchaseTransaction(listing);
      const signature = await this.wallet.sendTransaction(transaction, this.connection);
      await this.connection.confirmTransaction(signature, 'confirmed');

      const purchase = {
        listing,
        buyer: this.wallet.publicKey.toString(),
        purchasedAt: new Date().toISOString(),
        signature
      };

      return purchase;
    } catch (error) {
      console.error('Error buying NFT:', error);
      throw error;
    }
  }
} 