import { NgModule } from "@angular/core";
import { ChronometreComponent } from "./chronometre/chronometre.component";
import { ExternalAppComponent } from "./external/externalApp.component";
import { FormulaireComponent } from "./formulaire/formulaire.component";
import { PostitComponent } from "./postit/postit.component";
import { TextEditorComponent } from "./textEditor/textEditor.component";
import { CommonModule } from "@angular/common";
import { MaterialDesignModule } from "../materialDesign.module";
import { jqxSplitterComponent } from "jqwidgets-scripts/jqwidgets-ts/angular_jqxsplitter";
import { jqxKanbanComponent } from "jqwidgets-scripts/jqwidgets-ts/angular_jqxkanban";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { DynamicFormBuilderModule } from "./formulaire/dynamic-form-builder/dynamic-form-builder.module";

@NgModule({
  imports: [
    CommonModule,
    MaterialDesignModule,
    CKEditorModule,
    DynamicFormBuilderModule
  ],
  declarations: [
    ChronometreComponent,
    ExternalAppComponent,
    FormulaireComponent,
    PostitComponent,
    TextEditorComponent,
    jqxKanbanComponent,
    jqxSplitterComponent
  ],
  exports: [
    ChronometreComponent,
    ExternalAppComponent,
    FormulaireComponent,
    PostitComponent,
    TextEditorComponent
  ]
})
export class ApplicationsModule {}
