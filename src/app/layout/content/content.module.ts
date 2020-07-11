import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentComponent } from './content.component';
import { ContentRoutingModule } from './content-routing.module';
import { MaterialModule } from '../../shared/material.module';



@NgModule({
  declarations: [
    ContentComponent
  ],
  imports: [
    CommonModule,
    ContentRoutingModule,
    MaterialModule
  ]
})
export class ContentModule { }
