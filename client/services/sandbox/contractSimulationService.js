import { Connection, PublicKey, Transaction } from '@solana/web3.js';

export class ContractSimulationService {
  constructor(connection) {
    this.connection = connection;
  }

  async simulateContract(programId, instruction) {
    try {
      // Create a simulation environment
      const simulation = new Transaction();
      simulation.add(instruction);

      // Simulate the transaction
      const result = await this.connection.simulateTransaction(simulation);

      // Analyze simulation results
      return {
        success: !result.value.err,
        logs: result.value.logs,
        units: result.value.unitsConsumed,
        error: result.value.err,
        returnData: result.value.returnData
      };
    } catch (error) {
      console.error('Simulation error:', error);
      throw error;
    }
  }

  async validateProgram(programId) {
    try {
      const programInfo = await this.connection.getAccountInfo(
        new PublicKey(programId)
      );

      return {
        exists: !!programInfo,
        size: programInfo?.data.length || 0,
        executable: programInfo?.executable || false,
        owner: programInfo?.owner.toBase58()
      };
    } catch (error) {
      console.error('Program validation error:', error);
      throw error;
    }
  }

  async estimateResourceUsage(transaction) {
    try {
      const { value } = await this.connection.simulateTransaction(transaction);
      
      return {
        computeUnits: value.unitsConsumed,
        logs: value.logs,
        balanceNeeded: value.accounts?.map(acc => ({
          address: acc.pubkey.toBase58(),
          required: acc.lamports
        }))
      };
    } catch (error) {
      console.error('Resource estimation error:', error);
      throw error;
    }
  }
} 