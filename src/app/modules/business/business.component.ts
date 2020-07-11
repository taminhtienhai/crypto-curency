import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { ConnectionService } from '../../core/p2p/connection.service';
import { FirebaseService } from '../../data/service/firebase.service';
import { IndexeddbService } from '../../data/service/indexeddb.service';
import { BlockService } from '../../data/service/block.service';
import { Table } from '../../data/enum/database.info';
import { NotifierService } from 'angular-notifier';
import { NotifierType } from '../../shared/enum/SharedEnum';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss']
})
export class BusinessComponent implements OnInit {

  private isInitConnection = false;
  private onInit = false;

  constructor(
    private connSer: ConnectionService,
    private dbSer: IndexeddbService,
    private fireSer: FirebaseService,
    private blockSer: BlockService,
    private notifier: NotifierService
  ) {
  }

  ngOnInit(): void {
    // This should run async to not effect UX
    if (!this.isInitConnection && !this.onInit) {
      this.onInit = true;
      // * Turnoff this mode when being init or already init.
      this.initConnection().then(success => {
        this.isInitConnection = success;
        this.onInit = false;
      });
    }
    // Generate some coin for your wallet
    // This just for testing
    this.initGenesisBlock();
  }

  async initConnection(): Promise<boolean> {
    const peer = await this.connSer.startConnection();
    return true;
  }

  async initGenesisBlock(): Promise<void> {
    const { success, error, data: blockchain } = await this.dbSer.fetchAll(Table.BLOCK);
    if (!success) { this.notifier.notify(NotifierType.ERROR, error); }
    if (blockchain.length === 0) {
      const block = await this.blockSer.generateGenesis();
      if (!block) { console.log('No wallet found. Stop generation'); }
      console.log(block);
      const result = await this.dbSer.insert(Table.BLOCK, block);
      console.error(result.error);
    }
  }
}
