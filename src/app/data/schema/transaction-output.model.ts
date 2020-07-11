import { HashUtils } from '../utils/hash.util';
export class TransactionOutput {

  public id: string;
  public recipient: string;
  public amount: number;
  public timeStamp: number;

  constructor(recipient: string, amount: number) {
    this.recipient = recipient;
    this.amount = amount;
    this.timeStamp = Date.now();
  }

  /**
   * Check is this output is belong below publickey.
   * @param publicKey Any publickey
   */
  public isMine(publicKey: string): boolean {
    return publicKey === this.recipient;
  }

  /**
   * CalculateHash current output.
   */
  public async calculateHash(): Promise<string> {
    this.id = await HashUtils.hashSha256(this.recipient + this.amount + this.timeStamp);
    return this.id;
  }

}
