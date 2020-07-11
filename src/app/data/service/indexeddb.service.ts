import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { CommonResult } from '../type/general.type';
import { Table } from '../enum/database.info';

@Injectable({
  providedIn: 'root'
})
export class IndexeddbService {

  constructor(private indexSer: NgxIndexedDBService) { }

  public async insert(table: string, value: any): Promise<CommonResult> {
    let flag = true;
    let error = null;
    let data = null;
    try {
      data = await this.indexSer.add(table, value);
    } catch (err) {
      console.error(err);
      error = err;
      flag = false;
    }

    return { success: flag, error, data };
  }

  public async update(table: string, value: any): Promise<CommonResult> {
    let flag = true;
    let error = null;
    let data = null;
    try {
      data = await this.indexSer.update(table, value);
    } catch (err) {
      console.error(err);
      error = err;
      flag = false;
    }

    return { success: flag, error, data };
  }

  public async delete(table: string, value: any): Promise<CommonResult> {
    let flag = true;
    let error = null;
    let data = null;
    try {
      data = await this.indexSer.delete(table, value);
    } catch (err) {
      console.error(err);
      error = err;
      flag = false;
    }

    return { success: flag, error, data };
  }

  public async clear(table: string) {
    let flag = true;
    let error = null;
    let data = null;
    try {
      data = await this.indexSer.clear(table);
    } catch (err) {
      console.error(err);
      error = err;
      flag = false;
    }

    return { success: flag, error, data };
  }

  public async fetchAll(table: string): Promise<CommonResult> {
    let flag = true;
    let error = null;
    let data = null;
    try {
      data = await this.indexSer.getAll(table);
    } catch (err) {
      console.error(err);
      error = err;
      flag = false;
    }
    return { success: flag, error, data };
  }

  public async findBy(table: string, key: string, value: any) {
    let flag = true;
    let error = null;
    let data = null;
    try {
      data = await this.indexSer.getByIndex(table, key, value);
    } catch (err) {
      console.error(err);
      error = err;
      flag = false;
    }
    return { success: flag, error, data };
  }
}
