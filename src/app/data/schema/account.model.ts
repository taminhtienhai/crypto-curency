import { User } from './user.model';
import { HashUtils } from '../utils/hash.util';
import { CommonResult } from '../type/general.type';
import { peerPrefix } from '@data/constants/CommonConstant';
import { ConnectStatus } from '../enum/database.info';
export class Account {

  public id: string;
  public username: string;
  public password: string;
  public peerId: string;
  public status: string;
  public userInfo: User;
  public wallets: string[];

  constructor(username: string, password: string, id?: string) {
    this.username = username;
    this.password = password;
    this.id = id;
  }

  buildUser(user: User) {
    this.userInfo = user;
    return this;
  }

  public async build(): Promise<CommonResult> {
    let flag = true;
    let error = null;
    let data = null;
    try {
      this.peerId = await HashUtils.hashSha256(this.username + this.password + Date.now().toString());
      const hashPassword = await HashUtils.hashSha256(this.password);
      const userInfo = await this.userInfo.build();
      data = {
        username: this.username,
        password: hashPassword,
        peerId: peerPrefix.concat(this.peerId),
        status: ConnectStatus.OFFLINE,
        userInfo,
        wallets: this.wallets ?? [],
        cash: 1000
      };
    } catch (err) {
      console.error(err);
      flag = false;
      error = err;
    }

    return { success: flag, error, data };
  }

  get value() {
    return { username: this.username, password: this.password };
  }

}
