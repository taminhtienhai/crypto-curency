import { Injectable } from '@angular/core';
import { SendInfo } from '@data/type/general.type';
import { CoinBase } from '../constants/CommonConstant';
import { TransactionInput } from '../schema/transaction-input.model';
import { Transaction } from '../schema/transaction.model';
import { BlockchainService } from './blockchain.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private static sequence = 0;

  constructor(
    private readonly blockChainSer: BlockchainService
  ) { }

  /**
   * Create a fully transaction.
   * @param sendInfo User request
   * @returns a new Transaction
   */
  async createTransaction(sendInfo: SendInfo[]): Promise<Transaction> {
    console.log('createTransaction: START');
    const transaction = new Transaction(sendInfo);
    const inputs: TransactionInput[] = [];
    // Setup input
    for (const info of sendInfo) {
      if (info.sender === CoinBase.name) { continue; }
      const total = transaction.calculateTotal(info);
      const newInput = await this.blockChainSer.calculateInputs(total, info.sender);
      inputs.push(...newInput);
    }
    transaction.transactionInputs = inputs;
    // Setup output
    await transaction.calculateOutputs();
    // Setup hash
    transaction.transactionId = await transaction.calculateHash();
    console.log(transaction.transactionId);
    console.log('createTransaction: END');
    return transaction;
  }
}
