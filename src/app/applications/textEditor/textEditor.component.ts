import {Component, Input, OnInit} from '@angular/core';
import {ResourcesService} from '../../services/resources.service';
import {AppsService} from '../../services/apps.service';
import {LoggerService} from '../../services/logger.service';
import {DatabaseService} from '../../services/database.service';
import {ActivityService} from '../../services/activity.service';
import { trigger, transition, useAnimation } from '@angular/animations';
import { pulse } from 'ng-animate';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {ChangeEvent} from '@ckeditor/ckeditor5-angular/ckeditor.component';

@Component({
  selector: 'app-text-editor',
  templateUrl: './textEditor.component.html',
  styleUrls: ['./textEditor.component.scss'],
  animations: [
    trigger('pulse', [transition('* => *', useAnimation(pulse, {
      params: { timing: 1, delay: 0 }
    }))])
  ]
})

export class TextEditorComponent implements OnInit {

  editorOptions: any;
  resource: any;
  latestSaveInMinute: number;
  pulse: any;
  class: string;
  @Input() appId;
  public Editor = ClassicEditor;

  constructor(public applicationService: AppsService,
              private logger: LoggerService,
              private databaseService: DatabaseService,
              private activityService: ActivityService) {

    this.class = 'margin-left';

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
    /*const autosave = setInterval( () => {this.save();} , 30000);*/
  }

  ngOnInit(): void {

    this.latestSaveInMinute = 0;

    setInterval( () => {
      this.latestSaveInMinute++;
      if (this.latestSaveInMinute >= 5) {
        this.class = 'margin-left pulse-button';
      }
      else {
        this.class = 'margin-left';
      }
    }, 60000);

    this.applicationService.getRessources(this.appId).then( res => {
      console.log(res);
      console.log(res['rows']);
      this.databaseService.getDocument(res['rows'][0]['id']).then( doc => {
        console.log(doc);
        this.resource = doc;
      });
    });
  }

  onChange( { editor }: ChangeEvent ) {
    this.resource.text = editor.getData();
  }

  save() {
    console.log('manualsave');
    this.latestSaveInMinute = 0;
    this.databaseService.getDocument(this.resource._id).then( res => {
      if (res['text'] !== this.resource.text) {
        res['text'] = this.resource.text;
        console.log(res);
        this.databaseService.updateDocument(res).then(() => {
          this.logger.log('Update', this.activityService.activityLoaded.id, this.appId, 'Save text editor');
          }
        );
      }
    });
  }
}
