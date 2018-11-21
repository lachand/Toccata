import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "dialog-new-ressource",
  templateUrl: "./dialogNewRessource.component.html",
  styleUrls: ["./dialogNewRessource.component.scss"]
})
export class DialogNewRessourceComponent implements OnInit {
  formNewRes: FormGroup;
  error: Array<any>;
  type: any;
  file: any;
  fileName: String;

  constructor(
    private dialogRef: MatDialogRef<DialogNewRessourceComponent>,
    public formBuilder: FormBuilder
  ) {
    this.type = "";
    this.fileName = "Aucun fichier sélectionné";
  }

  clickFile(e) {
    this.type = "File";
    /*
    if (this.checked()) {
      document.getElementById("hiddenFile").click();
    }
    */
  }

  clickLink(e) {
    this.type = "Link";
    /*
    if (this.checked()) {
      this.dialogRef.close({type: 'Link', stepOrActivity: this.formNewRes.value.stepOrActivity});
    }
    */
  }

  validate(e) {
    if (this.type === "Link" && this.checked()) {
      this.addLink();
    } else if (this.type === "File" && this.checked()) {
      this.addFile();
    }
  }

  cancel() {
    this.dialogRef.close({ type: "Closed" });
  }

  /**
   * Reset errors array
   */
  errorReset() {
    this.error["stepOrAct"] = false;
    this.error["url"] = false;
  }

  checked() {
    this.errorReset();
    let checked = true;
    if (this.formNewRes.value.stepOrAct === "") {
      this.error["stepOrAct"] = true;
      checked = false;
    }
    if (this.formNewRes.value.url === "" && this.type === "Link") {
      this.error["url"] = true;
      checked = false;
    }
    return checked;
  }

  addFile() {
    const input = document.querySelectorAll("input");
    this.file = input[input.length - 1].files[0];
    this.dialogRef.close({
      type: "File",
      data: this.file,
      stepOrActivity: this.formNewRes.value.stepOrActivity,
      name: this.formNewRes.value.name
    });
  }

  uploadFile() {
    const input = document.querySelectorAll("input");
    this.file = input[input.length - 1].files[0];
    this.fileName = this.file.name;
  }

  loadFile(e) {
    document.getElementById("hiddenFile").click();
  }

  addLink() {
    this.dialogRef.close({
      type: "Link",
      url: this.formNewRes.value.url,
      stepOrActivity: this.formNewRes.value.stepOrActivity,
      name: this.formNewRes.value.name
    });
  }

  ngOnInit(): void {
    this.formNewRes = this.formBuilder.group({
      stepOrActivity: ["step", Validators.required],
      name: ["", Validators.required],
      url: [""]
    });

    this.error = [];
    this.errorReset();
  }
}
