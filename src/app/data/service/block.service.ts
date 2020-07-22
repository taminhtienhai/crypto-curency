import { Injectable } from '@angular/core';
import { Block } from '@data/schema/block.model';
import { NotifierType, SessionAtribute } from '@shared/enum/SharedEnum';
import { errorMessage } from '@shared/errors/ErrorMessage';
import { NotifierService } from 'angular-notifier';
import { CoinBase, DIFFICULT } from '../constants/CommonConstant';
import { AccountDoc, Operator, Table } from '../enum/database.info';
import { Transaction } from '../schema/transaction.model';
import { CommonResult, SendInfo } from '../type/general.type';
import { QueryBuiler } from '../utils/query.util';
import { FirebaseService } from './firebase.service';
import { TransactionService } from './transaction.service';
import { SessionUtils } from '@shared/utils/session.util';
import { IndexeddbService } from './indexeddb.service';

@Injectable({
  providedIn: 'root'
})
export class BlockService {

  constructor(
    private tranSer: TransactionService,
    private fireSer: FirebaseService,
    private notifier: NotifierService,
    private dbSer: IndexeddbService
  ) { }

  /**
   * Auto Generate first Block if not exist.
   * @returns Promise<Block>
   * @errors throw Error
   */
  public async generateGenesis(): Promise<Block> {
    console.log('generateGenesis: START');
    const user = SessionUtils.getUser();
    const account = await this.fireSer.readItem(Table.ACCOUNT, [
      QueryBuiler.createCondition(AccountDoc.USERNAME, Operator.EQUAL, user.username)
    ]);
    const { wallets } = account.data[0] as { wallets: string[] };
    console.log(wallets);
    // Stop generate if this account have none wallets inside.
    if (wallets.length === 0) { return null; }

    const sendInfo: SendInfo = { sender: CoinBase.name, targets: [] };
    for (const wallet of wallets) {
      sendInfo.targets.push({ recipient: wallet, amount: CoinBase.reward / wallets.length, description: null });
    }
    const transaction = await this.tranSer.createTransaction([sendInfo]);
    const outputs = await transaction.calculateOutputs();
    if (outputs.length === 0) {
      this.notifier.notify(NotifierType.ERROR, errorMessage.CREATE_FAIL);
      return;
    }
    const transactionId = await transaction.calculateHash();
    if (!transactionId) {
      this.notifier.notify(NotifierType.ERROR, errorMessage.CREATE_FAIL);
      return;
    }
    const { success, error, data: block } = await this.createBlock([transaction], DIFFICULT);
    if (!success) {
      this.notifier.notify(NotifierType.ERROR, error);
    }
    block.previousHash = 0;
    console.log('generateGenesis: END');
    return block;
  }

  /**
   * Create a Block depend on Transaction[]'s parameter.
   * @returns Promise<CommonResult>
   * @errors { success: false, error: [not_null], data: [null] }
   */
  public async createBlock(transactions: Transaction[], difficult: number): Promise<CommonResult> {
    console.log('createBlock: START');
    let flag = true;
    let error = null;
    let data = null;
    try {
      const block = new Block();
      block.previousHash = await this.getPreviousHash();
      for (const transaction of transactions) {
        block.add(transaction);
      }
      const merkletRoot = await block.calculateMerkletRoot();
      if (!merkletRoot) { throw new Error(errorMessage.EMPTY_VALUE); }
      const mineCoin: boolean = await block.mineBlock(difficult);
      if (!mineCoin) { throw new Error(errorMessage.CREATE_FAIL); }
      data = block.value;
    } catch (err) {
      console.error(err);
      flag = false;
      error = err;
    }
    console.log('createBlock: END');
    return { success: flag, error, data };
  }

  async getPreviousHash(): Promise<string> {
    const { success, error, data } = await this.dbSer.fetchAll(Table.BLOCK);
    if (!success) { throw new Error(error); }
    return data[data.length - 1]?.hash ?? '0';
  }
}
