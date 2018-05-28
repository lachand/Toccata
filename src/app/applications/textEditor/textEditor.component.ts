import {Component, Input, OnInit} from '@angular/core';
import {ResourcesService} from '../../services/resources.service';
import {AppsService} from '../../services/apps.service';
import {LoggerService} from '../../services/logger.service';
import {DatabaseService} from '../../services/database.service';
import {ActivityService} from 'app/services/activity.service';

@Component({
  selector: 'app-text-editor',
  templateUrl: './textEditor.component.html',
  styleUrls: ['./textEditor.component.scss']
})

export class TextEditorComponent implements OnInit {

  editorOptions: any;
  resource: any;
  @Input() appId;

  constructor(public applicationService: AppsService,
              private logger: LoggerService,
              private databaseService: DatabaseService,
              private activityService: ActivityService) {

    this.editorOptions = {
      toolbar: 'full',
      toolbar_full: [
        {
          name: 'basicstyles',
          items: ['Bold', 'Italic', 'Strike', 'Underline']
        },
        {name: 'paragraph', items: ['BulletedList', 'NumberedList', 'Blockquote']},
        {name: 'editing', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock']},
        {name: 'links', items: ['Link', 'Unlink']},
        '/',
        {
          name: 'styles',
          items: ['FontSize', 'TextColor', 'PasteText', 'PasteFromWord']
        },
        {name: 'insert', items: ['Image', 'Table']},
        {name: 'forms', items: ['Outdent', 'Indent']},
        {name: 'clipboard', items: ['Undo', 'Redo', 'saveButton']}
      ],
      disableNativeSpellChecker: false,
      uiColor: '#FAFAFA',
    };
  }

  ngOnInit(): void {

    this.applicationService.getRessources(this.appId).then( res => {
      if (res['docs'].length === 0) {
        const text = {
          '_id': `ressource_application_Text-Editor_${this.databaseService.guid()}`,
          'documentType': 'Ressource application',
          'application': this.appId,
          'applicationType': 'Editeur de texte',
          'ressourceType': 'Text',
          'text': '',
          'dbName': this.activityService.activityLoaded.dbName
        };
        this.databaseService.addDocument(text);
        this.resource = text;
      } else {
        this.resource = res['docs'][0];
      }
    });
  }

  save(event) {
    this.databaseService.getDocument(this.resource._id).then( res => {
      res['text'] = this.resource.text;
      this.databaseService.updateDocument(res);
    });
  }

}
