import { TransactionInput } from './transaction-input.model';
import { TransactionOutput } from './transaction-output.model';
import { errorMessage } from '@shared/errors/ErrorMessage';
import { CommonResult, SendInfo } from '../type/general.type';
import { HashUtils } from '../utils/hash.util';
export class Transaction {

  public transactionId: string;
  public timeStamp: number;

  public transactionInputs: TransactionInput[];
  public transactionOutputs: TransactionOutput[];

  public sendInfo: SendInfo[];

  constructor(sendInfo: SendInfo[]) {
    this.sendInfo = sendInfo;
    this.timeStamp = Date.now();
  }

  get value() {
    return {
      transactionId: this.transactionId,
      transactionInputs: this.transactionInputs,
      transactionOutputs: this.transactionOutputs,
      timeStamp: this.timeStamp
    };
  }

  public async init(): Promise<CommonResult> {
    console.log('init: START');
    if (!this.transactionInputs) {
      return { success: false, error: errorMessage.EMPTY_VALUE };
    }
    const initOutput = this.calculateOutputs();
    this.transactionId = await this.calculateHash();
    console.log('init: END');
  }

  public async calculateHash() {
    let hash = '';
    this.transactionOutputs.forEach(output => {
      hash = hash.concat(output.id);
    });
    this.transactionId = await HashUtils.hashSha256(hash);
    return this.transactionId;
  }

  public async verify(): Promise<CommonResult> {
    let flag = true;
    let error = null;
    try {
      // No input found
      if (this.transactionInputs.length === 0) { throw new Error(errorMessage.EMPTY_VALUE); }
      if (this.verifyTotalAmount() < 0) { throw new Error(errorMessage.NOT_ENOUGH_COIN); }
      for (const input of this.transactionInputs) {
        const verifySig = await input.verifySignarute();
        // Invalid signature
        if (!verifySig.success) { throw new Error(verifySig.error); }
      }
    } catch (err) {
      console.error(err);
      flag = false;
      error = err;
    }
    return { success: flag, error };
  }

  public verifyTotalAmount(): number {
    let totalInput = 0;
    let totalOutput = 0;
    for (const input of this.transactionInputs) {
      const { preOutput: { amount } } = input;
      totalInput += amount;
    }
    console.log(this.transactionInputs);
    for (const output of this.transactionOutputs) {
      const { amount } = output;
      totalOutput += amount;
    }
    console.log(this.transactionOutputs);
    const leftover = totalInput - totalOutput;
    console.log(leftover);
    return leftover;
  }

  /**
   * Setup output
   */
  public async calculateOutputs(): Promise<TransactionOutput[]> {
    const myOutput: TransactionOutput[] = [];
    try {
      for (const info of this.sendInfo) {
        for (const target of info.targets) {
          console.log(target.amount);
          const output = new TransactionOutput(target.recipient, target.amount);
          await output.calculateHash();
          myOutput.push(output);
        }
        if (info.sender === 'coinbase') { continue; }
        const returnOutput: TransactionOutput = this.returnOutput(info);
        await returnOutput.calculateHash();
        if (returnOutput) { myOutput.push(returnOutput); }
      }
      this.transactionOutputs = myOutput;
      return myOutput;
    } catch (err) {
      console.error(err);
    }
    return [];
  }

  public returnOutput(info: SendInfo): TransactionOutput {
    const leftAmount: number = this.calculateReturnAmount(info);
    if (leftAmount < 0) { throw new Error(errorMessage.NOT_ENOUGH_COIN); }
    if (leftAmount === 0) { return null; }
    return new TransactionOutput(info.sender, leftAmount);
  }

  public calculateReturnAmount(info: SendInfo): number {
    let totalInput = 0;
    const recipient = info.sender;
    for (const input of this.transactionInputs) {
      const { preOutput: { recipient: publicKey, amount } } = input;
      if (recipient === publicKey) { totalInput += amount; }
    }
    const totalOutput = this.calculateTotal(info);
    const leftAmount = totalInput - totalOutput;
    return leftAmount;
  }

  public calculateTotal(info: SendInfo): number {
    console.log('calculateTotal: START');
    let total = 0;
    if (!info.targets) {
      return 0;
    }
    try {
      for (const item of info.targets) {
        total += item.amount;
      }
    } catch (error) {
      console.error(error);
      return 0;
    }
    console.log('calculateTotal: END');
    return total;
  }

}
