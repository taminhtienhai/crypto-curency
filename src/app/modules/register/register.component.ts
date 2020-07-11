import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountDoc, Operator, Table } from '@data/enum/database.info';
import { Account } from '@data/schema/account.model';
import { User } from '@data/schema/user.model';
import { FirebaseService } from '@data/service/firebase.service';
import { QueryBuiler } from '@data/utils/query.util';
import { NotifierType } from '@shared/enum/SharedEnum';
import { MyErrorStateMatcher } from '@shared/error/ErrorFormHandle';
import { Message } from '@shared/messages/CommonMessage';
import { NotifierService } from 'angular-notifier';

enum RegisterControl {
  EMAIL = 'email',
  PASSWORD = 'password'
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(
    private readonly fb: FormBuilder,
    private readonly notifier: NotifierService,
    private fireSer: FirebaseService,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('RegisterComponent: START');
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['']
    });
    this.registerForm.setValidators(this.checkPasswords);
    console.log('RegisterComponent: END');
  }

  public checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    console.log('checkPasswords: START');
    const pass = group.controls.password.value;
    const confirmPass = group.controls.confirm.value;
    console.log('checkPasswords: END');
    return pass === confirmPass ? null : { notSame: true };
  }

  public async onRegister() {
    console.log('onRegister: START');
    try {
      // Check form Validation
      if (!this.registerForm.valid) { return; }
      const user = this.registerForm.value;
      // Build a new Account base on userinput.
      const accountCreation = await new Account(user.email, user.password).buildUser(new User('haita', 'haita')).build();
      if (!accountCreation.success) {
        console.error(accountCreation.error);
        this.notifier.notify(NotifierType.ERROR, Message.ACTION_FAILED);
        return;
      }
      console.log(accountCreation);
      // Check peerId and email existing.
      const newAccount = accountCreation.data;
      const result = await this.fireSer.isExist(
        Table.ACCOUNT, [
          QueryBuiler.createCondition(AccountDoc.PEERID, Operator.EQUAL, newAccount.peerId),
          QueryBuiler.createCondition(AccountDoc.USERNAME, Operator.EQUAL, newAccount.username)
        ]);
      if (!result.success) {
        console.error(result.error);
        this.notifier.notify(NotifierType.ERROR, Message.ACTION_FAILED);
        return;
      }
      const isExist = result.data;
      if (isExist) {
        console.log('Already existing');
        this.registerForm.controls[RegisterControl.EMAIL].setErrors({ alreadyExist: true });
        this.notifier.notify(NotifierType.ERROR, Message.EXISTING);
        return;
      }
      // Add Account.
      const addResult = await this.fireSer.addItem(Table.ACCOUNT, newAccount);
      if (!addResult.success) {
        console.error(addResult.error);
        this.notifier.notify(NotifierType.ERROR, Message.ACTION_FAILED);
        return;
      }
      this.notifier.notify(NotifierType.SUCCESS, Message.ACTION_SUCCESS);
      this.router.navigate(['login']);
    } catch (err) {
      console.error(err);
      this.notifier.notify(NotifierType.ERROR, err);
    }
    console.log('onRegister: END');
  }

}
