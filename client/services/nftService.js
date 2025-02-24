import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL 
} from '@solana/web3.js';
import { 
  createMint, 
  getOrCreateAssociatedTokenAccount, 
  mintTo 
} from '@solana/spl-token';
import { IPFSService } from './ipfsService';

export class NFTService {
  constructor(connection, wallet) {
    this.connection = connection;
    this.wallet = wallet;
    this.ipfsService = new IPFSService();
  }

  async mintNFT(metadata) {
    try {
      if (!this.wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      // Upload image to IPFS
      const imageUrl = await this.ipfsService.uploadImage(metadata.image);

      // Create metadata object
      const nftMetadata = {
        name: metadata.name,
        description: metadata.description,
        image: imageUrl,
        attributes: metadata.attributes,
        properties: {
          files: [{ uri: imageUrl, type: 'image/jpeg' }],
          category: 'image',
          creators: [{
            address: this.wallet.publicKey.toBase58(),
            share: 100
          }]
        }
      };

      // Upload metadata to IPFS
      const metadataUrl = await this.ipfsService.uploadMetadata(nftMetadata);

      // Create mint account
      const mint = await createMint(
        this.connection,
        this.wallet,
        this.wallet.publicKey,
        null,
        0  // 0 decimals for NFT
      );

      // Get token account
      const tokenAccount = await getOrCreateAssociatedTokenAccount(
        this.connection,
        this.wallet,
        mint,
        this.wallet.publicKey
      );

      // Mint one token (NFT)
      await mintTo(
        this.connection,
        this.wallet,
        mint,
        tokenAccount.address,
        this.wallet.publicKey,
        1  // Only mint 1 token
      );

      // TODO: Update token metadata

      return {
        mint: mint.toBase58(),
        tokenAccount: tokenAccount.address.toBase58(),
        metadata: metadataUrl,
        image: imageUrl
      };
    } catch (error) {
      console.error('Error minting NFT:', error);
      throw error;
    }
  }
} 