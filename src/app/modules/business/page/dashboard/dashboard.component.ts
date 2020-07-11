import { Component, OnInit } from '@angular/core';
import { IndexeddbService } from '@data/service/indexeddb.service';
import { Table } from '../../../../data/enum/database.info';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private dbSer: IndexeddbService,
    private logger: NGXLogger
  ) {
  }

  ngOnInit(): void {
    this.dbSer.fetchAll(Table.WALLET)
              .then(result => this.logger.debug(result));
  }

}
