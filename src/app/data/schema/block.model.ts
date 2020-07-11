import { errorMessage } from '../../shared/error/ErrorMessage';
import { HashUtils } from '../utils/hash.util';
import { Transaction } from './transaction.model';
export class Block {

  public hash: string;
  public previousHash: string;
  public merkletRoot: string;

  public transactions: Transaction[];
  public timeStamp: number;
  public nonce = 0;

  constructor() {
    this.transactions = [];
    this.timeStamp = Date.now();
  }

  get value() {
    return {
      hash: this.hash,
      previousHash: this.previousHash,
      merkletRoot: this.merkletRoot,
      transactions: this.transactions,
      nonce: this.nonce,
      timeStamp: this.timeStamp
    };
  }

  add(transaction: Transaction): boolean {
    try {
      if (!transaction) { throw new Error(errorMessage.EMPTY_VALUE); }
      this.transactions.push(transaction);
    } catch (err) {
      console.log(err);
      return false;
    }
    return true;
  }

  async calculateMerkletRoot(): Promise<string> {
    try {
      if (this.transactions.length === 0) { throw new Error(errorMessage.EMPTY_VALUE); }
      const hashRoot: string = this.transactions.map(it => it.transactionId).join('');
      this.merkletRoot = await HashUtils.hashSha256(hashRoot);
    } catch (error) {
      console.error(error);
      return null;
    }
    return this.merkletRoot;
  }

  async calculateHash(): Promise<string> {
    const hash = await HashUtils.hashSha256([
      this.previousHash,
      this.timeStamp,
      this.merkletRoot,
      this.nonce
    ].join(''));
    return hash;
  }

  async mineBlock(difficult: number): Promise<boolean> {
    try {
      const difficulty: string = '0'.repeat(difficult);
      this.hash = await this.calculateHash();
      while (!this.hash.startsWith(difficulty)) {
        this.nonce++;
        this.hash = await this.calculateHash();
        console.log(this.hash);
      }
    } catch (err) {
      console.error(err);
      return false;
    }
    return true;
  }
}
