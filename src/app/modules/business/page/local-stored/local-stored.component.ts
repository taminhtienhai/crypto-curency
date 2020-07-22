import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from '@data/enum/database.info';
import { IndexeddbService } from '@data/service/indexeddb.service';
import { NotifierType, Mode } from '@shared/enum/SharedEnum';
import { NotifierService } from 'angular-notifier';
import { BlockService } from '@data/service/block.service';
import { Block } from '@data/schema/block.model';
import { Transaction } from '@data/schema/transaction.model';
import { DIFFICULT } from '@data/constants/CommonConstant';
import { ConnectionService } from '@core/p2p/connection.service';

@Component({
  selector: 'app-local-stored',
  templateUrl: './local-stored.component.html',
  styleUrls: ['./local-stored.component.scss']
})
export class LocalStoredComponent implements OnInit {

  @ViewChild('transaction')
  transactionList;

  displayBlock = true;

  blocks: Block[] = [];
  transactions: Transaction[] = [];

  constructor(
    private readonly dbSer: IndexeddbService,
    private readonly notifier: NotifierService,
    private readonly blockSer: BlockService,
    private readonly connSer: ConnectionService
  ) { }

  ngOnInit(): void {
    this.displayAllBlock();
    this.displayALlTransaction();
  }

  public async displayAllBlock() {
    console.log('displayAllBlock: START');
    try {
      const { success, error, data } = await this.dbSer.fetchAll(Table.BLOCK);
      if (!success) { throw new Error(error); }
      this.blocks.push(...data);
      console.log(data);
    } catch (err) {
      console.log(err);
      this.notifier.notify(NotifierType.ERROR, err);
    }
    console.log('displayAllBlock: END');
  }

  public async displayALlTransaction() {
    console.log('displayALlTransaction: START');
    try {
      const { success, error, data } = await this.dbSer.fetchAll(Table.TRANSACTION);
      if (!success) { throw new Error(error); }
      console.log(data);
      this.transactions.push(...data);
      console.log(data);
    } catch (err) {
      console.log(err);
      this.notifier.notify(NotifierType.ERROR, err);
    }
    console.log('displayALlTransaction: END');
  }

  public async mineSelectedTransaction() {
    const selectedTransaction: Transaction[] = this.transactionList.selectedOptions.selected.map((it) => it.value);
    const { success, error, data: newBlock } = await this.blockSer.createBlock(selectedTransaction, DIFFICULT);
    console.log(newBlock);
    const peerConnecting: number = this.connSer.isConnectPeer();
    if (peerConnecting <= 0) { await this.connSer.connectRandomOnlinePeer(); }
    await this.dbSer.insert(Table.BLOCK, newBlock);
    await this.connSer.broadCastAll({ mode: Mode.NEW, type: Table.BLOCK, data: newBlock });
  }
}

