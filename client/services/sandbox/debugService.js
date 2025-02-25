import { Connection, PublicKey } from '@solana/web3.js';

export class DebugService {
  constructor(connection) {
    this.connection = connection;
    this.breakpoints = new Map();
    this.logs = [];
  }

  async attachDebugger(programId) {
    try {
      // Subscribe to program logs
      const subscriptionId = this.connection.onLogs(
        new PublicKey(programId),
        (logs) => {
          this.handleProgramLogs(logs);
        },
        'confirmed'
      );

      return subscriptionId;
    } catch (error) {
      console.error('Debug attachment error:', error);
      throw error;
    }
  }

  handleProgramLogs(logs) {
    const debugInfo = {
      timestamp: new Date(),
      logs: logs.logs,
      signature: logs.signature,
      err: logs.err
    };

    this.logs.push(debugInfo);
    this.checkBreakpoints(debugInfo);
  }

  setBreakpoint(condition, callback) {
    const id = Date.now().toString();
    this.breakpoints.set(id, { condition, callback });
    return id;
  }

  removeBreakpoint(id) {
    return this.breakpoints.delete(id);
  }

  checkBreakpoints(debugInfo) {
    this.breakpoints.forEach(({ condition, callback }) => {
      if (condition(debugInfo)) {
        callback(debugInfo);
      }
    });
  }

  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }

  async getVariableState(accountAddress) {
    try {
      const account = await this.connection.getAccountInfo(
        new PublicKey(accountAddress)
      );
      return account ? account.data : null;
    } catch (error) {
      console.error('Error getting variable state:', error);
      throw error;
    }
  }
} 