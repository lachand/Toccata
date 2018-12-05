import { ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';

@Component({
  selector: "dialog-text-edition",
  templateUrl: "./dialogTextEdition.component.html",
  styleUrls: ["./dialogTextEdition.component.scss"]
})
export class DialogTextEditionComponent {
  text: string;
  editionType: string;
  editorOptions: any;
  public Editor = ClassicEditor;

  constructor(
    private dialogRef: MatDialogRef<DialogTextEditionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.text = data.text;
    this.editionType = data.editionType;
    this.editorOptions = {
      toolbar: [
        "heading",
        "|",
        "bold",
        "italic",
        "link",
        "bulletedList",
        "numberedList",
        "blockQuote"
      ],
      heading: {
        options: [
          {
            model: "paragraph",
            title: "Paragraph",
            class: "ck-heading_paragraph"
          },
          {
            model: "heading1",
            view: "h1",
            title: "Heading 1",
            class: "ck-heading_heading1"
          },
          {
            model: "heading2",
            view: "h2",
            title: "Heading 2",
            class: "ck-heading_heading2"
          }
        ]
      }
    };
  }

  onChange({ editor }: ChangeEvent) {
    this.text = editor.getData();
  }

  /**
   * Close the dialog and return text value to parent
   */
  closeDialog() {
    this.dialogRef.close({ text: this.text });
  }
}
