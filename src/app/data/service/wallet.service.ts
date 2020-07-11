import { Injectable } from '@angular/core';
import { BlockchainService } from './blockchain.service';
import { TransactionOutput } from '../schema/transaction-output.model';
import { Wallet } from '../schema/wallet.model';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor(private blockChainSer: BlockchainService) { }

  public getBalance(wallet: Wallet): number {
    let total = 0;
    for (const item of this.blockChainSer.UTXOs) {
      const transactionOutput: TransactionOutput = item[1];
      if (transactionOutput.isMine(wallet.publicKey)) {
        wallet.UTXOs.set(transactionOutput.id, transactionOutput);
        total += transactionOutput.amount;
      }
    }
    return total;
  }
}
