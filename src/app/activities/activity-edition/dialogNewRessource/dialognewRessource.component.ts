import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'dialog-new-ressource',
  templateUrl: './dialogNewRessource.component.html',
})

export class DialogNewRessourceComponent implements OnInit {

  formNewRes: FormGroup;
  error: Array<any>;

  constructor(private dialogRef: MatDialogRef<DialogNewRessourceComponent>, public formBuilder: FormBuilder,) {
  }

  clickFile(e) {
    if (this.checked()) {
      document.getElementById("hiddenFile").click();
    }
  }

  clickLink(e) {
    if (this.checked()) {
      this.dialogRef.close({type: 'Link', stepOrActivity: this.formNewRes.value.stepOrActivity});
    }
  }

  /**
   * Reset errors array
   */
  errorReset() {
    this.error['stepOrAct'] = false;
  }

  checked() {
    this.errorReset();
    let checked = true;
    if (this.formNewRes.value.stepOrAct === '') {
      this.error['stepOrAct'] = true;
      checked = false;
    }
    return checked;
  }

  uploadFile() {
    const input = document.querySelectorAll('input');
    console.log(input);
    const file = input[input.length - 1].files[0];
    this.dialogRef.close({type: 'File', data: file, stepOrActivity: this.formNewRes.value.stepOrActivity});
  }

  ngOnInit(): void {
    this.formNewRes = this.formBuilder.group({
      stepOrActivity: ['', Validators.required]
    });

    this.error = new Array();
    this.errorReset();
  }

}
