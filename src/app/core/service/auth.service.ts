import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AccountDoc, Operator, Table } from '@data/enum/database.info';
import { User } from '@data/schema/user.model';
import { FirebaseService } from '@data/service/firebase.service';
import { HashUtils } from '@data/utils/hash.util';
import { QueryBuiler } from '@data/utils/query.util';
import { NotifierType, SessionAtribute } from '@shared/enum/SharedEnum';
import { errorMessage } from '@shared/error/ErrorMessage';
import { Message } from '@shared/messages/CommonMessage';
import { NotifierService } from 'angular-notifier';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public userSubject: BehaviorSubject<User>;

  constructor(
    private readonly fireSer: FirebaseService,
    private readonly notifier: NotifierService,
    private router: Router
  ) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('user')));
  }

  public get User() {
    return this.userSubject.value;
  }

  public async login(username: string, password: string): Promise<boolean> {
    console.log('login: START');
    try {
      const queryResult = await this.fireSer.readItem(Table.ACCOUNT, [
        QueryBuiler.createCondition(AccountDoc.USERNAME, Operator.EQUAL, username)
      ]);
      if (!queryResult.success) {
        this.notifier.notify(NotifierType.ERROR, queryResult.error);
        return false;
      }
      const account = queryResult.data;
      if (account.length > 1) {
        this.notifier.notify(NotifierType.ERROR, errorMessage.SHOULD_ONLY);
        return false;
      }
      if (account.length === 0) {
        this.notifier.notify(NotifierType.WARNING, errorMessage.NOT_EXIST);
        return false;
      }
      // Check Password is match.
      const userData = account[0];
      const hashPassword = userData.password;
      if (!(await this.comparePassword(password, hashPassword))) {
        this.notifier.notify(NotifierType.ERROR, errorMessage.NOT_MATCH);
        return false;
      }
      this.notifier.notify(NotifierType.SUCCESS, Message.ACTION_SUCCESS);
      // Save UserInfo.
      sessionStorage.setItem(SessionAtribute.USER, JSON.stringify(userData));
      this.userSubject.next(userData.userInfo);
    } catch (err) {
      console.log(err);
      return false;
    }
    this.router.navigate(['/business']);
    console.log('login: END');
    return true;
  }

  public async logout() {
    sessionStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  public async comparePassword(inputPassword: string, hashPassword: string): Promise<boolean> {
    console.log('comparePassword: START');
    const hashCurrentPassword = await HashUtils.hashSha256(inputPassword);
    console.log('comparePassword: END');
    return hashCurrentPassword === hashPassword;
  }
}
