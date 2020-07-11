import { Injectable } from '@angular/core';
import { AngularFirestore, Query } from '@angular/fire/firestore';
import { CommonResult, FirebaseCondition } from '../type/general.type';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private readonly afs: AngularFirestore) { }

  public async addItem(table: string, value: any): Promise<CommonResult> {
    console.log('addItem: START');
    let flag = true;
    let error = null;
    try {
      const collection = this.afs.collection(table);
      await collection.add(value);
    } catch (err) {
      console.error(err);
      flag = false;
      error = err;
    }
    console.log('addItem: END');
    return { success: flag, error };
  }

  public async readItemById(table: string, id: string) {
    console.log('readItem: START');
    let flag = true;
    let error = null;
    let data = null;
    try {
      const collection = this.afs.collection(table);
      data = await collection.doc(id).get().toPromise();
    } catch (err) {
      console.error(err);
      flag = false;
      error = err;
    }
    console.log('readItem: END');
    return { success: flag, error, data };
  }

  public async readItem(table: string, conditions?: FirebaseCondition[]): Promise<CommonResult> {
    console.log('readItem: START');
    let flag = true;
    let error = null;
    let data = null;
    let query: Query;
    conditions = conditions ?? [];
    try {
      const collection = this.afs.collection(table);
      const reference = collection.ref;
      query = reference;
      for (const con of conditions) {
        query = reference.where(con.document, con.operator, con.value);
      }
      data = (await query.get()).docs;
      data = data.map(item => {
        const result = item.data();
        result.id = item.id;
        return result;
      });
    } catch (err) {
      console.error(err);
      flag = false;
      error = err;
    }
    console.log('readItem: END');
    return { success: flag, error, data };
  }

  public async updateItem(table: string, id: string, value: any): Promise<CommonResult> {
    console.log('updateItem: START');
    let flag = true;
    let error = null;
    try {
      const collection = this.afs.collection(table);
      collection.doc(id).update(value);
    } catch (err) {
      flag = false;
      error = err;
    }
    console.log('updateItem: END');
    return { success: flag, error };
  }

  public async updateSingleItemDoc(table: string, id: string, value: any): Promise<CommonResult> {
    console.log('updateItem: START');
    let flag = true;
    let error = null;
    try {
      const collection = this.afs.collection(table);
      collection.doc(id).set(value);
    } catch (err) {
      flag = false;
      error = err;
    }
    console.log('updateItem: END');
    return { success: flag, error };
  }

  public async isExist(table: string, conditions: FirebaseCondition[] = []): Promise<CommonResult> {
    console.log('isExist: START');
    let flag = true;
    let error = null;
    let data = false;
    let query: Query;
    try {
      const collection = this.afs.collection(table);
      const reference = collection.ref;
      for (const con of conditions) {
        query = reference.where(con.document, con.operator, con.value);
      }
      data = (await query.get()).docs.length !== 0;
      // const result = collection.snapshotChanges().toPromise().then(rs => console.log(rs));
    } catch (err) {
      console.error(err);
      flag = false;
      error = err;
    }
    console.log('isExist: END');
    return { success: flag, error, data };
  }

  public async clear() {
    
  }
}
