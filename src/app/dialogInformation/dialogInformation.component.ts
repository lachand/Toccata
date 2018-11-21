import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-dialog-information",
  templateUrl: "./dialogInformation.component.html"
})
export class DialogInformationComponent {
  message: String;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.message = data.message;
  }
}
