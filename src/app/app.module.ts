import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@shared/material.module';
import { NavComponent } from '@layout/nav/nav.component';
import { FooterComponent } from '@layout/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxIndexedDBModule } from 'ngx-indexed-db';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { NotifierModule } from 'angular-notifier';

// Config env
import { environment } from '../environments/environment';
import { indexedDBConfig } from './config/IndexedDB';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    SharedModule,
    HttpClientModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebase),
    NgxIndexedDBModule.forRoot(indexedDBConfig),
    NotifierModule.withConfig(environment.notification),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
