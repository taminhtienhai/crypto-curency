// Crypto module
import * as eccryptoJS from 'eccrypto-js';
import { StringUtils } from './string.util';

export class HashUtils {

  constructor() {}

  public static async hashSha256(message: string): Promise<string> {
    const msg = eccryptoJS.utf8ToBuffer(message);
    const hash = await eccryptoJS.sha256(msg);
    return StringUtils.castBufferToString(hash);
  }

}
