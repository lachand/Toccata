import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material';
import {DialogConfirmationComponent} from "../../dialogConfirmation/dialogConfirmation.component";

@Component({
  selector: 'create-edit-postit',
  templateUrl: './createEditPostit.component.html'
})

export class CreateEditPostitComponent {
  dialogRef: MatDialogRef<any>;
  formTask: FormGroup;

  constructor(public formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public dialog: MatDialog) {
    this.formTask = this.formBuilder.group({
      taskName: [data.postit.label, Validators.required],
      estimation: [data.postit.estimation, Validators.required],
    });

  }

  update() {
    this.data.postit.label = this.formTask.value.taskName;
    this.data.postit.estimation = this.formTask.value.estimation;
    this.dialogRef.close({type: 'postit', value: this.data.postit});
  }

  close() {
    this.dialogRef.close({type: 'close'});
  }

  deletePostit() {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {data: {message: 'Voulez vous vraiment supprimer ce post-it ?'}});
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.dialogRef.close({type: 'delete', value: this.data.postit._id});
      }
    });
  }

}
