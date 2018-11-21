import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-dialog-confirmation",
  templateUrl: "./dialogConfirmation.component.html"
})
export class DialogConfirmationComponent {
  message: String;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.message = data.message;
  }
}
