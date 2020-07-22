import { Injectable } from '@angular/core';
import { FirebaseService } from '@data/service/firebase.service';
import { ConnectStatus, Table, AccountDoc, Operator } from '@data/enum/database.info';
import { SessionUtils } from '@shared/utils/session.util';
import { Account } from '@data/schema/account.model';
import { QueryBuiler } from '@data/utils/query.util';

@Injectable({
  providedIn: 'root'
})
export class ConnectionUtilService {

  constructor(
    private fireSer: FirebaseService
  ) {}

  public updateStatus(status: ConnectStatus) {
    const user: Account = SessionUtils.getUser();
    user.status = status;
    this.fireSer.updateItem(Table.ACCOUNT, user.id, user.value);
  }

  public async updatePeerStatus(peerId: string, status: ConnectStatus) {
    const { success, error, data } = await this.fireSer.readItem(Table.ACCOUNT, [
      QueryBuiler.createCondition(AccountDoc.PEERID, Operator.EQUAL, peerId)
    ]);
    if (!success) { throw new Error(error); }
    data.status = status;
    await this.fireSer.updateItem(Table.ACCOUNT, data.id, data);
  }

}
