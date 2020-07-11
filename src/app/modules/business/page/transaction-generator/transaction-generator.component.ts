import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from '@data/enum/database.info';
import { Wallet } from '@data/schema/wallet.model';
import { IndexeddbService } from '@data/service/indexeddb.service';
import { TransactionService } from '@data/service/transaction.service';
import { SendInfo } from '@data/type/general.type';
import { NotifierType } from '@shared/enum/SharedEnum';
import { NotifierService } from 'angular-notifier';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ConnectionService } from '../../../../core/p2p/connection.service';
import { CommonResult } from '../../../../data/type/general.type';

@Component({
  selector: 'app-transaction-generator',
  templateUrl: './transaction-generator.component.html',
  styleUrls: ['./transaction-generator.component.scss']
})
export class TransactionGeneratorComponent implements OnInit {

  // Control form data
  formGroup: FormGroup;
  transactionArray: any[] = [];
  wallets: Wallet[];
  walletOptions: Observable<Wallet[]>;
  sendInfo: SendInfo[] = [];

  sendMode = -1;

  constructor(
    private fb: FormBuilder,
    private logger: NGXLogger,
    private dbSer: IndexeddbService,
    private notifier: NotifierService,
    private tranSer: TransactionService,
    private connSer: ConnectionService
  ) {
    logger.info('Load Transaction Generator');
  }

  ngOnInit(): void {
    console.log('ngOnInit: START');
    this.formGroup = this.fb.group({
      sender: ['', Validators.required],
      recipient: ['', Validators.required],
      amount: ['', Validators.required],
      currency: [''],
      description: ['']
    });
    this.dbSer.fetchAll(Table.WALLET).then(result => {
      this.wallets = result.data;
      console.log(this.wallets);
      this.walletOptions = this.formGroup.get('sender').valueChanges.pipe(
        startWith(''),
        map((input: string) => !input ? this.wallets.slice() : this._filter(input))
      );
    });
    console.log('ngOnInit: END');
  }

  private _filter(value: string): Wallet[] {
    console.log('_filter: START');
    console.log('_filter: END');
    return this.wallets.filter(it =>
      // it.walletName.toLowerCase().indexOf(wallet.walletName) === 0 ||
      it.publicKey.startsWith(value)
    );
  }

  public displayChoiceAddress(wallet: Wallet): string {
    return wallet && wallet.publicKey ? wallet.publicKey : '';
  }

  public async sendCoin(): Promise<void> {
    this.logger.info('onSubmit: START');
    let foundWallet = false;
    try {
      const { sender, recipient, amount, description } = this.formGroup.value;
      for (const info of this.sendInfo) {
        if (info.sender === (sender.publicKey ?? sender)) {
          foundWallet = true;
          info.targets.push({ recipient, amount, description });
          break;
        }
      }
      if (this.sendInfo.length !== 0 && !foundWallet) {
        this.sendInfo.push({ sender: sender.publicKey ?? sender, targets: [{ recipient, amount, description }] });
      }
      if (this.sendInfo.length === 0) {
        this.sendInfo.push({ sender: sender.publicKey ?? sender, targets: [{ recipient, amount, description }] });
      }
      this.logger.debug(this.sendInfo);
    } catch (error) {
      this.logger.error(error);
      this.notifier.notify(NotifierType.ERROR, error);
    } finally {
      this.transactionArray.push(this.formGroup.value);
    }
    this.logger.info('onSubmit: END');
  }

  /**
   * Set SendInfo and Transaction[] to [].
   */
  public async clearData() {
    this.logger.info('clearData: START');
    this.transactionArray = [];
    this.sendInfo = [];
    this.logger.info('clearData: END');
  }

  /**
   * Broadcast a new Transaction to connecting Peer.
   */
  public async sendTransaction(): Promise<void> {
    this.logger.info('sendTransaction: START');
    this.sendMode = 0;
    try {
      const transaction = await this.tranSer.createTransaction(this.sendInfo);
      console.log(transaction);
      // Todo: Verify Transaction
      const { success: isValid, error } = await transaction.verify();
      if (!isValid) { throw new Error(error); }
      // Todo: Is connecting to any one, If not try connect
      const peerConnecting: number = this.connSer.isConnectPeer();
      if (peerConnecting <= 0) { await this.connSer.connectRandomOnlinePeer(); }
      // Todo: Broadcast it
      this.connSer.broadCastAll(transaction);
      this.logger.info('sendTransaction: END');
    } catch (err) {
      console.error(err);
      this.notifier.notify(NotifierType.ERROR, err);
      this.sendMode = -1;
    }
  }

  public deleteTransaction(indexed: number): void {
    this.logger.info('deleteTransaction: START');
    this.logger.debug(`Delete item index ${indexed}`);
    this.transactionArray = this.transactionArray.filter((value, index) => index !== indexed);
    this.logger.info('deleteTransaction: END');
  }

  public editTransaction(indexed: number): void {
    this.logger.info('editTransaction: START');
    const selectedTransaction = this.transactionArray[indexed];

    this.formGroup.patchValue({
      sender: selectedTransaction.sender,
      recipient: selectedTransaction.recipient,
      amount: selectedTransaction.amount,
      description: selectedTransaction.description,
      currency: selectedTransaction.currency
    });
    this.logger.info('editTransaction: END');
  }

}
