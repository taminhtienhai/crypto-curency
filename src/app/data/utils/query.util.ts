import { WhereFilterOp } from '@firebase/firestore-types';
import { FirebaseCondition } from '@data/type/general.type';

export class QueryBuiler {

  public static createCondition(field: string, operator: WhereFilterOp, value: any): FirebaseCondition {
    return { document: field, operator, value };
  }
}