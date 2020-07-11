import { WhereFilterOp } from '@firebase/firestore-types';

export type CommonResult = {
  success: boolean,
  error: string,
  data?: any
};

export type SendInfo = {
  sender: string,
  targets: {
    recipient: string,
    amount: number,
    description: string
  }[]
};

export type WalletSchema = {
  id?: string,
  publicKey: string,
  privateKey: string,
  walletName: string,
  createDate: Date
};

export type TransactionSchema = {
  id?: string,
  hash: string,
  v_in: any,
  v_out: any
};


export type FirebaseCondition = {
  document: string,
  operator: WhereFilterOp,
  value: any
};


