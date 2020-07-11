export class User {

  public fullname: string;
  public nickname: string;

  constructor(fullname: string, nickname: string) {
    this.fullname = fullname;
    this.nickname = nickname;
  }

  async build() {
    return { fullname: this.fullname, nickname: this.nickname };
  }
}
