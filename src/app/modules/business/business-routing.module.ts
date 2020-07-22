import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BusinessComponent } from './business.component';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { TransactionGeneratorComponent } from './page/transaction-generator/transaction-generator.component';
import { ExchangeComponent } from './page/exchange/exchange.component';
import { MarketComponent } from './page/market/market.component';
import { LocalStoredComponent } from './page/local-stored/local-stored.component';


const routes: Routes = [
  {
    path: '',
    component: BusinessComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'create-transaction', component: TransactionGeneratorComponent },
      { path: 'exchange', component: ExchangeComponent },
      { path: 'market', component: MarketComponent },
      { path: 'local-stored', component: LocalStoredComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessRoutingModule { }
