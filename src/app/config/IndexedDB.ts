import { DBConfig } from 'ngx-indexed-db';
import { Database } from '@data/enum/database.info';
import { Table } from '@data/enum/database.info';
import { Transaction, Wallet } from '@data/constants/CommonConstant';
import { Block } from '@data/constants/CommonConstant';

export const indexedDBConfig: DBConfig = {
  name: Database.MY_DB,
  version: 2,
  objectStoresMeta: [
    // Table Wallet
    {
      store: Table.WALLET,
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        Wallet.publicKey,
        Wallet.privateKey,
        Wallet.createDate
      ]
    },
    // Table Transaction
    {
      store: Table.TRANSACTION,
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        Transaction.transactionId,
        Transaction.transactionInputs,
        Transaction.transactionOutputs,
        Transaction.timeStamp
      ]
    },
    // Blockchain
    {
      store: Table.BLOCK,
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        Block.hash,
        Block.previousHash,
        Block.merkletRoot,
        Block.nonce,
        Block.timeStamp,
        Block.transactions
      ]
    }
  ]
};
