import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-dialog-confirmation',
  templateUrl: './dialogDuplicateName.component.html',
})

/**
 * Create a dialog to ask user for group name
 */
export class DialogDuplicateNameComponent implements OnInit{
  message: String;
  groupNameForm: FormGroup;
  errorGroupName: any;

  /**
   * Create the dialog
   * @param data
   */
  constructor(public formBuilder: FormBuilder, private dialogRef: MatDialogRef<DialogDuplicateNameComponent>) {
  }

  ngOnInit() {
    this.errorGroupName = false;
    this.groupNameForm = this.formBuilder.group({
      groupname: ''
    });
  }

  /**
   * Close the dialog and create a duplicate
   */
  validate() {
    console.log(this.groupNameForm);
    if (this.groupNameForm.value.groupname === '') {
      this.errorGroupName = true;
    } else {
      this.dialogRef.close({type: 'validate', value: this.groupNameForm.value.groupname});
    }
  }

  /**
   * Close the dialog
   */
  close_dialog() {
    this.dialogRef.close({type: 'close'});
  }

}
