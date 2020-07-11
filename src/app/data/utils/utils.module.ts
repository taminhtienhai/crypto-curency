import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CryptoUtils } from './crypto.util';
import { StringUtils } from './string.util';
import { HashUtils } from './hash.util';

const inportModule = [
  CryptoUtils,
  StringUtils,
  HashUtils,
  CryptoUtils
]

@NgModule({
  imports: [
    ...inportModule
  ],
  exports: [
    ...inportModule
  ]
})
export class UtilsModule { }
