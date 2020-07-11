import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { MaterialModule } from './material.module';



@NgModule({
  declarations: [
    ConfirmDialogComponent,
    ErrorPageComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class SharedModule { }
