import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/service/auth.service';
import { IndexeddbService } from '@data/service/indexeddb.service';
import { FirebaseService } from '@data/service/firebase.service';
import { Table } from '@data/enum/database.info';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  constructor(
    private readonly authSer: AuthService,
    private readonly dbSer: IndexeddbService,
    private readonly fireSer: FirebaseService
  ) { }

  ngOnInit(): void {
  }

  onLogout() {
    this.authSer.logout();
  }

  async resetLocalDB() {
    const { success, error, data } = await this.dbSer.clear(Table.WALLET);
    const blockResult = await this.dbSer.clear(Table.BLOCK);
    await this.dbSer.clear(Table.TRANSACTION);
    // if (!success) { console.log(error); }
    // if (success) { console.log(data); }
  }

}
