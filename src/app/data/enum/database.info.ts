export enum Database {
  MY_DB = 'mydb',
  CRYPTO = 'crypto'
}

export enum Table {
  WALLET = 'wallet',
  TRANSACTION = 'transaction',
  BLOCK = 'block',
  ACCOUNT = 'account',
  EXCHANGE = 'exchange'
}

export enum Operator {
  EQUAL = '==',
  GTE = '>=',
  LTE = '<=',
  GT = '>',
  LT = '<',
  ARRAY_CONTAIN = 'array-contains',
  IN = 'in',
  ARRAY_CONTAIN_ANY = 'array-contains-any'
}

export enum AccountDoc {
  USERNAME = 'username',
  PASSWORD = 'password',
  USER_INFO = 'userInfo',
  PEERID = 'peerId',
  WALLET = 'wallets',
  STATUS = 'status'
}

export enum WalletDoc {
  PUBLIC_KEY = 'publicKey',
  PRIVATE_KEY = 'privateKey',
  WALLET_NAME = 'walletName',
  REFERENCE_USER = 'referenceUser',
  CREATE_DATE = 'createDate'
}

export enum ConnectStatus {
  ONLINE = 'online',
  OFFLINE = 'offline'
}


