import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { errorMessage } from '@shared/errors/ErrorMessage';
import { Table, WalletDoc } from '../enum/database.info';
import { Block } from '../schema/block.model';
import { TransactionInput } from '../schema/transaction-input.model';
import { TransactionOutput } from '../schema/transaction-output.model';
import { Transaction } from '../schema/transaction.model';
import { Wallet } from '../schema/wallet.model';
import { CryptoUtils } from '../utils/crypto.util';
import { HashUtils } from '../utils/hash.util';
import { StringUtils } from '../utils/string.util';
import { IndexeddbService } from './indexeddb.service';

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {

  public blockchain: Block[] = [];
  public UTXOs: TransactionOutput[] = [];

  public genesisTransction: Transaction;
  public wallets: Set<Wallet> = new Set();

  constructor(
    private dbSer: IndexeddbService,
    private notifier: NotifierService
  ) { }

  /**
   * Get unpayment output.
   * @param total Amount coin required
   * @param publicKey sender publicKey
   */
  public async calculateInputs(total: number, publicKey: string): Promise<TransactionInput[]> {
    const myInputs: TransactionInput[] = [];
    if (this.UTXOs.length === 0) { await this.getUTXOs(); }
    for (const output of this.UTXOs) {
      if (output.recipient === publicKey) {
        total = total - output.amount;
        const newInput = await this.signInputs(output);
        if (newInput) {
          myInputs.push(newInput);
        }
      }
      if (total <= 0) { break; }
    }
    return myInputs;
  }

  /**
   * Fetch all unspend output.
   * @returns Promise<TransactionOutput[]>
   * @errors []
   */
  public async getUTXOs(): Promise<TransactionOutput[]> {
    let tranOutputs: TransactionOutput[] = [];
    this.blockchain = [];
    try {
      const blocks = await this.dbSer.fetchAll(Table.BLOCK);
      if (!blocks.success) { throw new Error(blocks.error); }
      if (blocks.data.length === 0) { throw new Error(errorMessage.EMPTY_VALUE); }
      // Put current block to list.
      this.blockchain.push(...blocks.data);
      // Asign return output values.
      tranOutputs = await this.calculateOutput();
    } catch (err) {
      console.error(err);
      tranOutputs = [];
    } finally {
      this.UTXOs = tranOutputs;
    }
    return tranOutputs;
  }

  /**
   * Calculate your output depend on your input info.
   * @returns Promise<TransactionOutput[]>
   * @errors throw Error
   */
  public async calculateOutput(): Promise<TransactionOutput[]> {
    this.UTXOs = [];
    // Add output as Unspend transaction.
    for (const block of this.blockchain) {
      block.transactions.forEach(transaction => {
        this.UTXOs.push(...transaction.transactionOutputs);
      });
    }
    // Remove spend transaction.
    for (const block of this.blockchain) {
      block.transactions.forEach(transaction => {
        let arrayIndex: number[] = transaction.transactionInputs.map(it => this.UTXOs.indexOf(it.preOutput));
        arrayIndex = arrayIndex.filter(it => it !== -1);
        arrayIndex.forEach(index => {
          this.UTXOs = this.UTXOs.slice(index, 1);
        });
      });
    }
    return this.UTXOs;
  }

  /**
   * Sign an input.
   * Make sure Input is your request.
   * @returns Promise<TransactionInput>
   * @errors null
   */
  public async signInputs(output: TransactionOutput): Promise<TransactionInput> {
    let signedInput: TransactionInput;
    try {
      if (!output) { throw new Error(errorMessage.EMPTY_VALUE); }
      const publicKey = output.recipient;
      const findResult = await this.dbSer.findBy(Table.WALLET, WalletDoc.PUBLIC_KEY, publicKey);
      if (!findResult.success) {
        return null;
      }
      const wallet = findResult.data;
      const hash = await HashUtils.hashSha256(output.recipient + output.amount + output.timeStamp);
      const signature = await CryptoUtils.signData(Buffer.from(wallet.privateKey, 'hex'), Buffer.from(hash, 'hex'));
      signedInput = new TransactionInput(output);
      signedInput.signature = StringUtils.castBufferToString(signature);
    } catch (err) {
      console.error(err);
      return null;
    }
    return signedInput;
  }

}
