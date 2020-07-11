import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  public openConfirmDialog(msg: string): Promise<any> {
    console.log('openConfirmDialog: START');
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: msg}
    });
    console.log('openConfirmDialog: END');
    return dialogRef.afterClosed().toPromise();
  }
}
