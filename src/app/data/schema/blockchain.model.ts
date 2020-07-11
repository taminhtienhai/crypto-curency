import { Block } from './block.model';
import { TransactionOutput } from './transaction-output.model';
export class Blockchain {

  public blockchain: Block[];
  public UTXOs: TransactionOutput[];

  constructor() { }
}
