import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService } from '@core/service/dialog.service';
import { Table } from '@data/enum/database.info';
import { Wallet } from '@data/schema/wallet.model';
import { IndexeddbService } from '@data/service/indexeddb.service';
import { CryptoUtils } from '@data/utils/crypto.util';
import { StringUtils } from '@data/utils/string.util';
import { Message } from '@shared/messages/CommonMessage';
import { SessionUtils } from '@shared/utils/session.util';
import { NotifierService } from 'angular-notifier';
import { KeyPair } from 'eccrypto-js';
import { WalletService } from '@core/service/wallet.service';
import { AccountDoc, Operator } from '@data/enum/database.info';
import { FirebaseService } from '@data/service/firebase.service';
import { QueryBuiler } from '@data/utils/query.util';
import { NotifierType } from '@shared/enum/SharedEnum';
import { errorMessage } from '@shared/error/ErrorMessage';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {

  formGroup: FormGroup;
  limit = 10;

  constructor(
    private fb: FormBuilder,
    private dbSer: IndexeddbService,
    private router: Router,
    private dialogSer: DialogService,
    private walletSer: WalletService,
    private fireSer: FirebaseService,
    private notifier: NotifierService
  ) { }

  ngOnInit(): void {
    console.log('ngOnInit WalletComponent: START');
    // Init Form
    this.formGroup = this.fb.group({
      publicKey: [''],
      privateKey: [''],
      walletName: ['', Validators.pattern('[a-zA-Z ]+')]
    });
    console.log('ngOnInit WalletComponent: END');
  }

  /**
   * Change other KeyPair
   */
  public async refreshKeyPair(): Promise<void> {
    console.log('refreshKeyPair: START');
    let run = true;
    let keyPair: KeyPair = null;
    let count = 0;
    try {
      do {
        keyPair = CryptoUtils.generateKeyPair();
        if (keyPair) {
          run = false;
        }
        count++;
      } while (run || count !== this.limit);
      this.formGroup.patchValue({
        publicKey: StringUtils.castBufferToString(keyPair.publicKey),
        privateKey: StringUtils.castBufferToString(keyPair.privateKey)
      });
    } catch (err) {
      console.error(err);
    }
    console.log('refreshKeyPair: END');
  }

  /**
   * Emit when submit WalletForm.
   */
  public async saveWallet(): Promise<void> {
    console.log('saveWallet: START');
    // * This return `string` not `boolean`
    const isConfirm = await this.dialogSer.openConfirmDialog(Message.CONFIRM);
    if (isConfirm === 'false') { return; }
    // Check form validation.
    if (!this.formGroup.valid) { return; }
    try {
      const walletInfo = this.formGroup.value;
      const user = SessionUtils.getUser();
      if (!user) { throw new Error(errorMessage.NOT_AUTH); }

      const { success, error, data: [account] } = await this.fireSer.readItem(Table.ACCOUNT, [
        QueryBuiler.createCondition(AccountDoc.USERNAME, Operator.EQUAL, user.username)
      ]);
      if (!success) { throw new Error(error); }
      // Update Wallet to Firebase
      const { success: createSuccess, error: createError} = await this.walletSer.createNewWallet(walletInfo.publicKey, account.id, account);
      if (!createSuccess) { throw new Error(createError); }
      // Save to IndexedDB
      const saveResult = await this.dbSer.insert(Table.WALLET,
        new Wallet(walletInfo.publicKey, walletInfo.privateKey, walletInfo.walletName, account.id));
      if (!saveResult.success) { throw new Error(saveResult.error); }

      this.router.navigate(['/business']);
    } catch (err) {
      console.error(err); // ! Maybe API error or formGroup error
      this.notifier.notify(NotifierType.ERROR, err);
    }
    console.log('saveWallet: END');
  }

}
