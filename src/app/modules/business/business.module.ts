import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessRoutingModule } from './business-routing.module';
import { BusinessComponent } from './business.component';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { TransactionGeneratorComponent } from './page/transaction-generator/transaction-generator.component';
import { MaterialModule } from '../../shared/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ExchangeComponent } from './page/exchange/exchange.component';
import { MarketComponent } from './page/market/market.component';
import { LocalStoredComponent } from './page/local-stored/local-stored.component';


@NgModule({
  declarations: [
    BusinessComponent,
    DashboardComponent,
    TransactionGeneratorComponent,
    ExchangeComponent,
    MarketComponent,
    LocalStoredComponent
  ],
  imports: [
    CommonModule,
    BusinessRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class BusinessModule { }
