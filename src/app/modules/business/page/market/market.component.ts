import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { FirebaseService } from '@data/service/firebase.service';
import { Table } from '@data/enum/database.info';
import { QueryBuiler } from '@data/utils/query.util';
import { Operator, AccountDoc } from '@data/enum/database.info';
import { SessionUtils } from '@shared/utils/session.util';
import { NotifierType } from '@shared/enum/SharedEnum';
import { Message } from '@shared/messages/CommonMessage';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})
export class MarketComponent implements OnInit {

  exchangeRequests: any[] = [];

  constructor(
    private notifier: NotifierService,
    private fireSer: FirebaseService
  ) { }

  ngOnInit(): void {
    console.log('ngOnInit: START');
    const username = SessionUtils.getUser().username;
    this.fireSer.readItem(Table.EXCHANGE).then(result => {
      const queryData = result.data.filter(it => it.amount !== 0 && it.sender !== username && it.status === 'waiting');
      this.exchangeRequests.push(...queryData);
    });
    console.log('ngOnInit: END');
  }

  async onAction(requestid: string) {
    console.log('onAction: START');
    const readData = await this.fireSer.readItemById(Table.EXCHANGE, requestid);
    const requestData = readData.data.data();
    const balance = requestData.amount * 3.5;
    const user = SessionUtils.getUser();
    const account = await this.fireSer.readItem(Table.ACCOUNT, [
      QueryBuiler.createCondition(AccountDoc.USERNAME, Operator.EQUAL, user.username)
    ]);
    user.cash = user.cash - balance;
    await this.fireSer.updateItem(Table.ACCOUNT, account.data[0].id, user);
    requestData.status = 'sold';
    requestData.exchanger = user.username;
    this.fireSer.updateItem(Table.EXCHANGE, readData.data.id, requestData);
    this.notifier.notify(NotifierType.SUCCESS, Message.ACTION_SUCCESS);
    console.log('onAction: END');
  }

}
