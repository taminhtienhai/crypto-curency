export const peerPrefix = 'ctc';

export const DIFFICULT = 2;

export const CoinBase = {
  name: 'coinbase',
  reward: 100
};

export const Wallet = {
  publicKey: { name: 'publicKey', keypath: 'publicKey', options: { unique: true } },
  privateKey: { name: 'privateKey', keypath: 'privateKey', options: { unique: false } },
  walletName: { name: 'walletName', keypath: 'walletName', options: { unique: true } },
  referenceUser: { name: 'referenceUser', keypath: 'referenceUser', options: { unique: false } },
  createDate: { name: 'createDate', keypath: 'createDate', options: { unique: true } }
};

export const Transaction = {
  transactionId: { name: 'transactionId', keypath: 'transactionId', options: { unique: true } },
  transactionInputs: { name: 'transactionInputs', keypath: 'transactionInputs', options: { unique: false } },
  transactionOutputs: { name: 'transactionOutputs', keypath: 'transactionOutputs', options: { unique: false } },
  timeStamp: { name: 'timeStamp', keypath: 'timeStamp', options: { unique: true } }
};

export const Block = {
  hash: { name: 'hash', keypath: 'hash', options: { unique: true } },
  previousHash: { name: 'previousHash', keypath: 'previousHash', options: { unique: true } },
  merkletRoot: { name: 'merkletRoot', keypath: 'merkletRoot', options: { unique: false } },
  transactions: { name: 'transactions', keypath: 'transactions', options: { unique: false, multiEntry: true } },
  nonce: { name: 'nonce', keypath: 'nonce', options: { unique: false } },
  timeStamp: { name: 'timeStamp', keypath: 'timeStamp', options: { unique: true } }
};
