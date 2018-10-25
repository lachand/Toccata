import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {ActivityService} from '../../../services/activity.service';
import {LoggerService} from '../../../services/logger.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';

@Component({
  selector: 'app-activity-description-edit',
  templateUrl: './activityDescriptionEdit.component.html',
  styleUrls: ['./activityDescriptionEdit.component.scss']
})

export class ActivityDescriptionEditComponent implements OnInit{
  descriptionEdition: boolean;
  public description: String = '';
  editorOptions: any;
  @Input() edit: boolean;
  @Input() type: string;
  latestSaveInMinute: number;
  public Editor = ClassicEditor;

  constructor(public activityService: ActivityService,
              private logger: LoggerService,
              private ref: ChangeDetectorRef) {

    if (this.activityService.activityLoaded.description !== 'Il n\'y a aucune description') {
      this.description = this.activityService.activityLoaded.description;
    }

    this.latestSaveInMinute = 0;

    setInterval( () => {
      this.latestSaveInMinute++;
    }, 60000);

    this.editorOptions = {
      toolbar: [ 'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote' ],
      heading: {
        options: [
          { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
          { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
          { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' }
        ]
      }
    };



    this.activityService.changes.subscribe(change => {

      let previousDescription: String;

      if ((change.type === 'Activity' || change.type === 'Sequence') && change.doc._id === this.activityService.activityLoaded._id && change.doc.type === 'Sequence' && this.type === 'Loaded') {
        console.log(change.doc._id, this.activityService.activityLoaded._id);
        previousDescription = this.description;
        this.latestSaveInMinute = 0;
        this.description = change.doc.description;
      } else if ((change.type === 'Activity' || change.type === 'Sequence') && change.doc._id === this.activityService.activityLoaded.parent && change.doc.type === 'Main' && this.type === 'Parent') {
        previousDescription = this.description;
        console.log(change.doc._id, this.activityService.activityLoaded._id);
        this.latestSaveInMinute = 0;
        this.description = change.doc.description;
      }
      if (change.type === 'ChangeActivity' && this.type === 'Loaded' && previousDescription !== this.description) {
        console.log(change.type);
        previousDescription = this.description;
        this.latestSaveInMinute = 0;
        this.description = change.doc.description;
      }
      if (!this.ref['destroyed'] && previousDescription !== this.description) {
        this.ref.detectChanges();
      }
    });
  }

  onChange( { editor }: ChangeEvent ) {
    this.description = editor.getData();
  }

  /**
   * Open or close text editor
   */
  switchDescription() {
      //this.description = this.activityService.activityLoaded.description;
      if (this.edit) {
        this.descriptionEdition = !this.descriptionEdition;
      }
  }

  /**
   * Save the description
   */
  saveDescription(system: boolean = true) {
    console.log(this.description);
    if (this.descriptionEdition) {
      this.descriptionEdition = !this.descriptionEdition;
      if (this.type === 'Loaded') {
        return this.activityService.activityEdit(this.activityService.activityLoaded._id, 'description', this.description, system);
      } else {
        return this.activityService.activityEdit(this.activityService.activityLoaded.parent, 'description', this.description, system);
      }
    }
    else {
      this.descriptionEdition = !this.descriptionEdition;
      return new Promise( resolve => {
        resolve(0);
      });
    }
  }

  /**
   * Change the description of an activity
   */
  changeTheDescription() {
    this.latestSaveInMinute = 0;
    this.saveDescription(false);
  }

  focusOut() {
    console.log("focus out");
    this.changeTheDescription();
  }

  ngOnInit(): void {
    console.log(this.type);
    this.descriptionEdition = false;
    if (this.type === 'Loaded') {
      this.description = this.activityService.activityLoaded.description;
    } else {
      this.activityService.getActivityInfos(this.activityService.activityLoaded.parent).then(res => {
        this.description = res['description'];
      });
    }
    console.log(this.description);
  }

}
