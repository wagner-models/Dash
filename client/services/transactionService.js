import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL,
  TransactionInstruction
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, createTransferInstruction } from '@solana/spl-token';

export class TransactionService {
  constructor(connection, wallet) {
    this.connection = connection;
    this.wallet = wallet;
  }

  async createListingTransaction(nftMint, price) {
    try {
      if (!this.wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      // Create a new transaction
      const transaction = new Transaction();

      // Add listing instruction
      // Note: This is a simplified version. In production, you'd interact with a marketplace program
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: this.wallet.publicKey,
          toPubkey: new PublicKey(nftMint),
          lamports: LAMPORTS_PER_SOL * 0.001 // Listing fee
        })
      );

      // Get the latest blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = this.wallet.publicKey;

      return transaction;
    } catch (error) {
      console.error('Error creating listing transaction:', error);
      throw error;
    }
  }

  async createPurchaseTransaction(listing) {
    try {
      if (!this.wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      // Create a new transaction
      const transaction = new Transaction();

      // Add purchase instructions
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: this.wallet.publicKey,
          toPubkey: new PublicKey(listing.seller),
          lamports: listing.price * LAMPORTS_PER_SOL
        })
      );

      // Get the latest blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = this.wallet.publicKey;

      return transaction;
    } catch (error) {
      console.error('Error creating purchase transaction:', error);
      throw error;
    }
  }
} 