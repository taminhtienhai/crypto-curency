import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NotifierType, SessionAtribute, ExchangeAction, ExchangeStatus } from '@shared/enum/SharedEnum';
import { NGXLogger } from 'ngx-logger';
import { errorMessage } from '@shared/error/ErrorMessage';
import { FirebaseService } from '@data/service/firebase.service';
import { Table } from '@data/enum/database.info';
import { Message } from '../../../../shared/messages/CommonMessage';
import { QueryBuiler } from '../../../../data/utils/query.util';
import { Operator } from '../../../../data/enum/database.info';
import { SessionUtils } from '../../../../shared/utils/session.util';

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
    private logger: NGXLogger,
    private fireSer: FirebaseService
  ) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      amount: [0, [Validators.required, Validators.min(1)]]
    });
    this.logger.debug(SessionUtils.getUser());
    this.fireSer.readItem(Table.EXCHANGE, [
      QueryBuiler.createCondition('exchanging', Operator.EQUAL, SessionUtils.getUser().username)
    ]).then(result => {
      this.exchangeHistory.push(...result.data);
    });
  }

  exchange(value: number) {
    if (this.isCash) {
      this.exchangeAmount = value / this.exchangeRate;
      return;
    }
    this.exchangeAmount = value * this.exchangeRate;
  }

  async sendExchangeRequest() {
    this.logger.info('sendExchangeRequest: START');
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
      this.logger.error(err);
      this.notifier.notify(NotifierType.ERROR, err);
    }
    this.logger.info('sendExchangeRequest: END');
  }

  createExchangeObject() {
    this.logger.info('createExchangeObject: START');
    const sender = SessionUtils.getUser().username;
    const amount = !this.isCash ? this.formGroup.get('amount').value : this.formGroup.get('amount').value / this.exchangeRate;
    const action = this.isBuy ? ExchangeAction.BUY : ExchangeAction.SELL;
    const status = ExchangeStatus.WAITING;
    this.logger.info('createExchangeObject: END');
    return { sender, exchanger: null, amount, action, status, timeStamp: Date.now() };
  }

}
