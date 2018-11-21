import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "dialog-resource-edition",
  templateUrl: "./dialogResourceEdition.component.html"
})

/**
 * Create a dialog to ask user for group name
 */
export class DialogResourceEditionComponent implements OnInit {
  message: String;
  resourceNameForm: FormGroup;
  errorResourceName: any;

  /**
   * Create the dialog
   * @param data
   */
  constructor(
    public formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<DialogResourceEditionComponent>
  ) {}

  ngOnInit() {
    this.errorResourceName = false;
    this.resourceNameForm = this.formBuilder.group({
      resourcename: ""
    });
  }

  /**
   * Close the dialog and create a duplicate
   */
  validate() {
    if (this.resourceNameForm.value.resourcename === "") {
      this.errorResourceName = true;
    } else {
      this.dialogRef.close({
        type: "validate",
        value: this.resourceNameForm.value.resourcename
      });
    }
  }

  /**
   * Close the dialog
   */
  close_dialog() {
    this.dialogRef.close({ type: "close" });
  }
}
