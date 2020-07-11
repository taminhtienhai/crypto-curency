import { Component, OnInit } from '@angular/core';
import { IndexeddbService } from '@data/service/indexeddb.service';
import { Table } from '../../../../data/enum/database.info';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private dbSer: IndexeddbService
  ) {
  }

  ngOnInit(): void {
    this.dbSer.fetchAll(Table.WALLET).then(result => console.log(result));
  }

}
