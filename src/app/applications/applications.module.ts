import { NgModule } from '@angular/core';
import {ChronometreComponent} from './chronometre/chronometre.component';
import {ExternalAppComponent} from './external/externalApp.component';
import {FormulaireComponent} from './formulaire/formulaire.component';
import {PostitComponent} from './postit/postit.component';
import {TextEditorComponent} from './textEditor/textEditor.component';
import {CommonModule} from '@angular/common';
import {MaterialDesignModule} from '../materialDesign.module';
import {jqxSplitterComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxsplitter';
import {FieldBuilderComponent} from './formulaire/dynamic-form-builder/field-builder/field-builder.component';
import {FileComponent} from './formulaire/dynamic-form-builder/atoms/file';
import {TextBoxComponent} from './formulaire/dynamic-form-builder/atoms/textbox';
import {RadioComponent} from './formulaire/dynamic-form-builder/atoms/radio';
import {jqxKanbanComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxkanban';
import {DynamicFormBuilderComponent} from './formulaire/dynamic-form-builder/dynamic-form-builder.component';
import {DropDownComponent} from './formulaire/dynamic-form-builder/atoms/dropdown';
import {CheckBoxComponent} from './formulaire/dynamic-form-builder/atoms/checkbox';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MaterialDesignModule,
    CKEditorModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ChronometreComponent,
    ExternalAppComponent,
    FormulaireComponent,
    PostitComponent,
    TextEditorComponent,
    jqxKanbanComponent,
    jqxSplitterComponent,
    DynamicFormBuilderComponent,
    FieldBuilderComponent,
    TextBoxComponent,
    DropDownComponent,
    CheckBoxComponent,
    FileComponent,
    RadioComponent
  ],
  exports: [
    ChronometreComponent,
    ExternalAppComponent,
    FormulaireComponent,
    PostitComponent,
    TextEditorComponent,
  ]
})
export class ApplicationsModule {}
