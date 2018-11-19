import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

// text,email,tel,textarea,password,
@Component({
  selector: 'textbox',
  template: `
      <div [formGroup]="form">
        <mat-form-field class="example-full-width">
        <input matInput *ngIf="!field.multiline" [attr.type]="field.type"  [id]="field.name" [name]="field.name" [formControlName]="field.name" [placeholder]="field.label">
        <textarea matInput *ngIf="field.multiline" [class.is-invalid]="isDirty && !isValid" [formControlName]="field.name" [id]="field.name"
        rows="9" [placeholder]="field.placeholder"></textarea>
        </mat-form-field>
      </div> 
    `,
  styleUrls: ['style-form.scss']
})
export class TextBoxComponent {
  @Input() field:any = {};
  @Input() form:FormGroup;
  get isValid() { return this.form.controls[this.field.name].valid; }
  get isDirty() { return this.form.controls[this.field.name].dirty; }

  constructor() {

  }
}
