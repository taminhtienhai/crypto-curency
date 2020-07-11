import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { FirebaseService } from '@data/service/firebase.service';
import { NotifierService } from 'angular-notifier';
import { errorMessage } from '@shared/error/ErrorMessage';
import { NotifierType } from '@shared/enum/SharedEnum';
import { Table, AccountDoc, Operator } from '@data/enum/database.info';
import { QueryBuiler } from '@data/utils/query.util';
import { HashUtils } from '@data/utils/hash.util';
import { Message } from '@shared/messages/CommonMessage';
import { AuthService } from '../../core/service/auth.service';

enum LoginControl {
  USERNAME = 'username',
  PASSWORD = 'password'
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly logger: NGXLogger,
    private readonly notifier: NotifierService,
    private readonly authSer: AuthService
  ) { }

  ngOnInit(): void {
    this.logger.info('LoginComponent: START');
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.logger.info('LoginComponent: END');
  }

  /**
   * Behavior on login action.
   */
  public async onLogin() {
    this.logger.info('onLogin: START');
    try {
      // Form Validation
      if (!this.loginForm.valid) {
        this.logger.warn(errorMessage.INVALID_VALUE);
        this.notifier.notify(NotifierType.WARNING, errorMessage.INVALID_VALUE);
        return;
      }
      const userForm = this.loginForm.value;
      await this.authSer.login(userForm.username, userForm.password);
    } catch (err) {
      console.error(err);
      this.notifier.notify(NotifierType.ERROR, err);
    }
    this.logger.info('onLogin: END');
  }

}
