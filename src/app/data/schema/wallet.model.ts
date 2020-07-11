import { TransactionOutput } from './transaction-output.model';
export class Wallet {

  public publicKey: string;
  public privateKey: string;
  public walletName: string;
  public referenceUser: string;
  public createDate: number;

  public UTXOs = new Map<string, TransactionOutput>();

  constructor(pubKey: string, priKey: string, walletName: string, userId: string) {
    this.publicKey = pubKey;
    this.privateKey = priKey;
    this.walletName = walletName;
    this.referenceUser = userId;
    this.createDate = Date.now();
  }

}
