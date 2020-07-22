import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '@core/p2p/connection.service';
import { AuthService } from '@core/service/auth.service';
import { Table } from '@data/enum/database.info';
import { IndexeddbService } from '@data/service/indexeddb.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  constructor(
    private readonly authSer: AuthService,
    private readonly dbSer: IndexeddbService
    // private readonly connSer: ConnectionService
  ) { }

  ngOnInit(): void {
  }

  onLogout() {
    // this.connSer.disconnect();
    this.authSer.logout();
  }

  async resetLocalDB() {
    await this.dbSer.clear(Table.WALLET);
    await this.dbSer.clear(Table.BLOCK);
    await this.dbSer.clear(Table.TRANSACTION);
  }

}
