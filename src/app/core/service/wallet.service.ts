import { Injectable } from '@angular/core';
import { SessionAtribute } from '@shared/enum/SharedEnum';
import { FirebaseService } from '../../data/service/firebase.service';
import { Table, AccountDoc, Operator } from '@data/enum/database.info';
import { QueryBuiler } from '@data/utils/query.util';
import { Account } from '@data/schema/account.model';
import { CommonResult } from '@data/type/general.type';
import { IndexeddbService } from '@data/service/indexeddb.service';
import { SessionUtils } from '@shared/utils/session.util';
import { NotifierService } from 'angular-notifier';
import { NotifierType } from '@shared/enum/SharedEnum';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor(
    private readonly fireSer: FirebaseService,
    private readonly dbSer: IndexeddbService,
    private readonly notifier: NotifierService
  ) { }

  /**
   * Generate identify wallet name belong only to you.
   * @returns Promise<string>: WalletName
   */
  public async getLocalWallet(): Promise<string> {
    const user = SessionUtils.getUser();
    if (!user) { return null; }
    const queryResult = await this.fireSer.readItem(Table.ACCOUNT, user.username);
    if (!queryResult.success) { return null; }
    return Table.WALLET.concat(queryResult.data[0].peerId);
  }

  /**
   * 
   */
  public async createNewWallet(publicKey: string, accountId: string, account: Account): Promise<CommonResult> {
    console.log('createNewWallet: START');
    try {
      const { success: exist, error: isExistError } = await this.fireSer.isExist(Table.ACCOUNT, [
        QueryBuiler.createCondition(AccountDoc.WALLET, Operator.ARRAY_CONTAIN, publicKey)
      ]);
      if (!exist) { throw new Error(isExistError); }
      // Add new Wallet Address
      account.wallets = account.wallets ?? [];
      account.wallets.push(publicKey);
      // Update wallet in firebase
      const { success: updateSuccess, error: updateError } = await this.fireSer.updateItem(Table.ACCOUNT, accountId, account);
      if (!updateSuccess) { throw new Error(updateError); }
    } catch (err) {
      console.error(err);
      return { success: false, error: err };
    }
    console.log('createNewWallet: END');
    return { success: true, error: null };
  }

  /**
   * * Remove wallet in local if not exist on firebase.
   */
  public async updateLocalWallet() {
    const { username } = SessionUtils.getUser();
    const { success, error, data } = await this.fireSer.readItem(Table.ACCOUNT, [
      QueryBuiler.createCondition(AccountDoc.USERNAME, Operator.EQUAL, username)
    ]);
    if (!success) { this.notifier.notify(NotifierType.ERROR, error); }
    const { success: localSuccess, error: localError, data: localWallets } = await this.dbSer.fetchAll(Table.WALLET);
    if (!localSuccess) { this.notifier.notify(NotifierType.ERROR, localError); }
    const wallets: string[] = data[0].wallets;
    for (const wallet of localWallets) {
      const index: number = wallets.indexOf(wallet.publicKey);
      if (index === -1) { this.dbSer.delete(Table.WALLET, wallet.id); }
    }
  }

}
