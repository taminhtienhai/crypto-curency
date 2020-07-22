import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierType } from '@shared/enum/SharedEnum';
import { errorMessage } from '@shared/errors/ErrorMessage';
import { NotifierService } from 'angular-notifier';
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
    private readonly notifier: NotifierService,
    private readonly authSer: AuthService
  ) { }

  ngOnInit(): void {
    console.log('LoginComponent: START');
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    console.log('LoginComponent: END');
  }

  /**
   * Behavior on login action.
   */
  public async onLogin() {
    console.log('onLogin: START');
    try {
      // Form Validation
      if (!this.loginForm.valid) {
        console.log(errorMessage.INVALID_VALUE);
        this.notifier.notify(NotifierType.WARNING, errorMessage.INVALID_VALUE);
        return;
      }
      const userForm = this.loginForm.value;
      await this.authSer.login(userForm.username, userForm.password);
    } catch (err) {
      console.error(err);
      this.notifier.notify(NotifierType.ERROR, err);
    }
    console.log('onLogin: END');
  }

}
