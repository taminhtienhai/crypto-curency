import * as eccryptoJS from 'eccrypto-js';
import { KeyPair } from 'eccrypto-js';
import { CommonResult } from '../type/general.type';
import { errorMessage } from '../../shared/error/ErrorMessage';

export class CryptoUtils {

  constructor() { }

  public static generateKeyPair(): KeyPair {
    let keyPair: KeyPair = null;
    try {
      keyPair = eccryptoJS.generateKeyPair();
    } catch (e) {
      console.error(e);
    }
    return keyPair;
  }

  public static signData(privateKey: Buffer, hash: Buffer): Buffer {
    let signature = null;
    try {
      signature = eccryptoJS.sign(privateKey, hash);
    } catch (e) {
      console.error(e);
    }
    return signature;
  }

  public static verifyData(publicKey: Buffer, hash: Buffer, signature: Buffer): CommonResult {
    let flag = true;
    let err = null;
    try {
      eccryptoJS.verify(publicKey, hash, signature);
    } catch (e) {
      console.error(e);
      err = errorMessage.FAKE_SIGNATURE;
      flag = false;
    }
    return { success: flag, error: err };
  }
}
