import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Operator, Table } from '@data/enum/database.info';
import { FirebaseService } from '@data/service/firebase.service';
import { QueryBuiler } from '@data/utils/query.util';
import { ExchangeAction, ExchangeStatus, NotifierType } from '@shared/enum/SharedEnum';
import { errorMessage } from '@shared/errors/ErrorMessage';
import { Message } from '@shared/messages/CommonMessage';
import { SessionUtils } from '@shared/utils/session.util';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss']
})
export class ExchangeComponent implements OnInit {

  formGroup: FormGroup;

  isBuy = true;
  isCash = true;
  exchangeRate = 3.5;
  exchangeAmount = 0;

  exchangeHistory: any[] = [];

  constructor(
    private fb: FormBuilder,
    private notifier: NotifierService,
    private fireSer: FirebaseService
  ) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      amount: [0, [Validators.required, Validators.min(1)]]
    });
    console.log(SessionUtils.getUser());
    this.fireSer.readItem(Table.EXCHANGE, [
      QueryBuiler.createCondition('exchanger', Operator.EQUAL, SessionUtils.getUser().username)
    ]).then(result => {
      this.exchangeHistory.push(...result.data);
    });
  }

  /**
   * Exchange action
   * @param value Coin you want to exchage
   */
  exchange(value: number) {
    if (this.isCash) {
      this.exchangeAmount = value / this.exchangeRate;
      return;
    }
    this.exchangeAmount = value * this.exchangeRate;
  }

  async sendExchangeRequest() {
    console.log('sendExchangeRequest: START');
    try {
      // Check validation
      if (!this.formGroup.valid) { throw new Error(errorMessage.INVALID_VALUE); }
      const exchangeObject = this.createExchangeObject();
      const insertResult = await this.fireSer.addItem(Table.EXCHANGE, exchangeObject);
      if (!insertResult.success) {
        throw new Error(insertResult.error);
      }
      this.notifier.notify(NotifierType.SUCCESS, Message.ACTION_SUCCESS);
    } catch (err) {
      console.error(err);
      this.notifier.notify(NotifierType.ERROR, err);
    }
    console.log('sendExchangeRequest: END');
  }

  createExchangeObject() {
    console.log('createExchangeObject: START');
    const sender = SessionUtils.getUser().username;
    const amount = !this.isCash ? this.formGroup.get('amount').value : this.formGroup.get('amount').value / this.exchangeRate;
    const action = this.isBuy ? ExchangeAction.BUY : ExchangeAction.SELL;
    const status = ExchangeStatus.WAITING;
    console.log('createExchangeObject: END');
    return { sender, exchanger: null, amount, action, status, timeStamp: Date.now() };
  }

}
