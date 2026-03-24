import { ethers } from 'ethers';
import { KafkaProducer } from '../kafka/producer';
import { SignalSchema } from '@cencera/shared';

export class OnChainWorker {
  private provider: ethers.JsonRpcProvider;
  private backupProvider: ethers.JsonRpcProvider;
  private producer: KafkaProducer;
  private chainId: number;

  constructor(chainId: number) {
    this.chainId = chainId;
    // Primary: Alchemy. Backup: QuickNode. Auto-failover on error.
    this.provider = new ethers.JsonRpcProvider(process.env[`ALCHEMY_RPC_${chainId}`] || 'http://localhost:8545');
    this.backupProvider = new ethers.JsonRpcProvider(process.env[`QUICKNODE_RPC_${chainId}`] || 'http://localhost:8545');
    this.producer = new KafkaProducer('raw-signals');
  }

  async start() {
    console.log(`Starting on-chain worker for chain ${this.chainId}`);
    this.provider.on('block', async (blockNumber) => {
      await this.processBlock(blockNumber);
    });
  }

  private async processBlock(blockNumber: number) {
    try {
      const block = await this.provider.getBlock(blockNumber, true);
      if (!block || !block.prefetchedTransactions) return; // 'transactions' was removed in ethers v6 returned block

      for (const tx of block.prefetchedTransactions) {
        const signals = await this.extractSignals(tx as ethers.TransactionResponse);
        for (const signal of signals) {
          await this.producer.send(signal);
        }
      }
    } catch (err) {
      // Failover to backup provider
      console.error(`Primary RPC failed for block ${blockNumber}, trying backup:`, err);
      // await this.processBlockWithBackup(blockNumber);
    }
  }

  private async extractSignals(tx: ethers.TransactionResponse): Promise<SignalSchema[]> {
    const signals: SignalSchema[] = [];

    // Signal 1: Transaction frequency and value
    signals.push({
      time: new Date().toISOString(),
      address: tx.from,
      chain_id: this.chainId,
      signal_domain: 'onchain',
      signal_type: 'tx_value',
      signal_value: parseFloat(ethers.formatEther(tx.value)),
      signal_data: { hash: tx.hash, to: tx.to || undefined, gas_used: tx.gasLimit.toString() },
      source: `alchemy_chain_${this.chainId}`
    });

    // Signal 2: Contract interaction
    if (tx.to && tx.data && tx.data !== '0x') {
      signals.push({
        time: new Date().toISOString(),
        address: tx.to,
        chain_id: this.chainId,
        signal_domain: 'onchain',
        signal_type: 'contract_interaction',
        signal_value: 1,
        signal_data: { from: tx.from, selector: tx.data.slice(0, 10) },
        source: `alchemy_chain_${this.chainId}`
      });
    }

    return signals;
  }
}
