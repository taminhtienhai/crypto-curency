import { SessionAtribute } from '../enum/SharedEnum';
export class SessionUtils {

  static getUser() {
    return JSON.parse(sessionStorage.getItem(SessionAtribute.USER));
  }
}
