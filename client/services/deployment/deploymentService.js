import { Connection, Keypair, SystemProgram, Transaction } from '@solana/web3.js';
import { Program, BN, AnchorProvider } from '@project-serum/anchor';

export class DeploymentService {
  constructor(connection, wallet) {
    this.connection = connection;
    this.wallet = wallet;
    this.provider = new AnchorProvider(connection, wallet, {});
  }

  async deployContract(contractCode, config = {}) {
    try {
      // Create program keypair
      const programKeypair = Keypair.generate();
      
      // Build the contract
      const { programId, buffer } = await this.buildContract(contractCode);

      // Deploy the program
      const deployment = await this.connection.requestAirdrop(
        programKeypair.publicKey,
        1000000000 // 1 SOL for testing
      );
      
      await this.connection.confirmTransaction(deployment);

      return {
        programId: programId.toString(),
        deploymentTx: deployment,
        status: 'success'
      };
    } catch (error) {
      console.error('Deployment error:', error);
      throw error;
    }
  }

  async estimateDeploymentCost(contractCode) {
    // Calculate approximate cost
    const programSize = Buffer.from(contractCode).length;
    const rentExemptionAmount = await this.connection.getMinimumBalanceForRentExemption(programSize);
    
    return {
      estimatedSol: rentExemptionAmount / 1e9, // Convert lamports to SOL
      programSize,
      rentExemptionAmount
    };
  }

  async verifyDeployment(programId) {
    try {
      const accountInfo = await this.connection.getAccountInfo(new PublicKey(programId));
      return {
        exists: !!accountInfo,
        executable: accountInfo?.executable || false,
        owner: accountInfo?.owner.toString()
      };
    } catch (error) {
      console.error('Verification error:', error);
      throw error;
    }
  }
} 