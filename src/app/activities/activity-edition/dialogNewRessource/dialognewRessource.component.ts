import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'dialog-new-ressource',
  templateUrl: './dialogNewRessource.component.html',
})

export class DialogNewRessourceComponent {

  constructor(private dialogRef: MatDialogRef<DialogNewRessourceComponent>) {
  }

  clickFile(e) {
    console.log(e);
    document.getElementById("hiddenFile").click();
  }

  uploadFile() {
    const input = document.querySelector('input');
    const file = input.files[0];
    this.dialogRef.close({type: 'File', data: file});
  }

}
