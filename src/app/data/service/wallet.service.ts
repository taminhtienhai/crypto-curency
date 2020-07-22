import { Injectable } from '@angular/core';
import { BlockchainService } from './blockchain.service';
import { TransactionOutput } from '../schema/transaction-output.model';
import { Wallet } from '../schema/wallet.model';
import { IndexeddbService } from './indexeddb.service';
import { FirebaseService } from './firebase.service';
import { SessionUtils } from '../../shared/utils/session.util';
import { Account } from '../schema/account.model';
import { Table, Operator, WalletDoc } from '@data/enum/database.info';
import { QueryBuiler } from '../utils/query.util';
import { AccountDoc } from '../enum/database.info';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor(
    private blockChainSer: BlockchainService,
    private dbSer: IndexeddbService,
    private fireSer: FirebaseService
  ) { }

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
