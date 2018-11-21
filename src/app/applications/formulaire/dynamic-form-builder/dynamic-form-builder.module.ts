import { NgModule } from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {FieldBuilderComponent} from './field-builder/field-builder.component';
import {FileComponent} from './atoms/file';
import {TextBoxComponent} from './atoms/textbox';
import {RadioComponent} from './atoms/radio';
import {DynamicFormBuilderComponent} from './dynamic-form-builder.component';
import {DropDownComponent} from './atoms/dropdown';
import {CheckBoxComponent} from './atoms/checkbox';
import {MaterialDesignModule} from '../../../materialDesign.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialDesignModule,
  ],
  declarations: [
    DynamicFormBuilderComponent,
    FieldBuilderComponent,
    TextBoxComponent,
    DropDownComponent,
    CheckBoxComponent,
    FileComponent,
    RadioComponent,
  ],
  exports: [
    DynamicFormBuilderComponent,
  ]
})
export class DynamicFormBuilderModule {}
