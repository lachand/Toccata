import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { isNullOrUndefined } from "util";

@Component({
  selector: "dynamic-form-builder",
  template: `
    <form
      *ngIf="!isNullOrUndefined(fields)"
      (ngSubmit)="onSubmit.emit(this.form.value)"
      [formGroup]="form"
      class="form-horizontal"
    >
      <div *ngFor="let field of fields">
        <field-builder [field]="field" [form]="form"></field-builder>
      </div>
      <div class="form-row"></div>
      <div class="form-group row">
        <div class="col-md-3"></div>
        <div class="col-md-9">
          <button
            mat-button
            type="submit"
            [disabled]="!form.valid"
            class="btn btn-primary"
          >
            Valider le questionnaire
          </button>
        </div>
      </div>
    </form>
  `
})
export class DynamicFormBuilderComponent implements OnInit {
  @Output() onSubmit = new EventEmitter();
  @Input() fields: any[] = [];
  form: FormGroup;

  constructor() {}

  ngOnInit() {
    let fieldsCtrls = {};
    for (let f of this.fields) {
      if (f.type != "checkbox") {
        fieldsCtrls[f.name] = new FormControl(
          f.value || "",
          Validators.required
        );
      } else {
        let opts = {};
        for (let opt of f.options) {
          opts[opt.key] = new FormControl(opt.value);
        }
        fieldsCtrls[f.name] = new FormGroup(opts);
      }
    }
    this.form = new FormGroup(fieldsCtrls);
  }

  isNullOrUndefined(elmt) {
    return isNullOrUndefined(elmt);
  }
}
