import { Component, OnInit } from '@angular/core';
import { IndexeddbService } from '@data/service/indexeddb.service';
import { Table } from '../../../../data/enum/database.info';
import { BlockchainService } from '../../../../data/service/blockchain.service';
import { TransactionOutput } from '../../../../data/schema/transaction-output.model';
import { SessionUtils } from '../../../../shared/utils/session.util';
import { BlockService } from '../../../../data/service/block.service';
import { Transaction } from '../../../../data/schema/transaction.model';
import { DIFFICULT } from '../../../../data/constants/CommonConstant';
import { Block } from '../../../../data/schema/block.model';
import { ConnectionService } from '../../../../core/p2p/connection.service';
import { NotifierService } from 'angular-notifier';
import { DataType, Mode, NotifierType } from '../../../../shared/enum/SharedEnum';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  balance = 0;

  constructor(
    private dbSer: IndexeddbService,
    private blockchainSer: BlockchainService,
    private blockSer: BlockService,
    private connSer: ConnectionService,
    private notifier: NotifierService
  ) {
    this.updateBalance();
  }

  ngOnInit(): void {
    this.dbSer.fetchAll(Table.WALLET).then(result => console.log(result));
  }

  async updateBalance() {
    const { wallets } = SessionUtils.getUser();
    this.balance = 0;
    const transactionOutput: TransactionOutput[] = await this.blockchainSer.getUTXOs();
    console.log(transactionOutput);
    for (const output of transactionOutput) {
      if (wallets.includes(output.recipient)) {
        this.balance += output.amount;
      }
    }
  }

  async mineAllTransaction() {
    try {
      const { success, error, data } = await this.dbSer.fetchAll(Table.TRANSACTION);
      if (!success) { throw new Error(error); }
      const { success: isSuccess, error: createError, data: block } = await this.blockSer.createBlock(data, DIFFICULT);
      if (!isSuccess) { throw new Error(createError); }
      await this.dbSer.insert(Table.BLOCK, block);
      await this.dbSer.clear(Table.TRANSACTION);
      await this.connSer.connectRandomOnlinePeer();
      await this.connSer.broadCastAll({ type: DataType.BLOCK, mode: Mode.NEW, data: block });
      await this.updateBalance();
    } catch (err) {
      this.notifier.notify(NotifierType.ERROR, err);
    }
  }

}
