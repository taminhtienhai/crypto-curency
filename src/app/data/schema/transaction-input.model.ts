import { TransactionOutput } from './transaction-output.model';
import { CommonResult } from '../type/general.type';
import { CryptoUtils } from '../utils/crypto.util';
export class TransactionInput {

  public preOutput: TransactionOutput;
  public signature: string;

  constructor(output: TransactionOutput) {
    this.preOutput = output;
  }

  public async verifySignarute(): Promise<CommonResult> {
    let flag = true;
    let error = null;
    const hashData = Buffer.from(this.preOutput.id, 'hex');
    const signatureBuffer = Buffer.from(this.signature, 'hex');
    const addressBuffer = Buffer.from(this.preOutput.recipient, 'hex');
    try {
      const result = CryptoUtils.verifyData(addressBuffer, hashData, signatureBuffer);
      if (!result.success) {
        flag = false;
        error = result.error;
      }
    } catch (err) {
      console.error(err);
      flag = false;
      error = err;
    }
    return { success: flag, error };
  }
}
