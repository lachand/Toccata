import {Component, Input, OnInit} from '@angular/core';
import {ActivityService} from '../../../services/activity.service';
import {LoggerService} from '../../../services/logger.service';

@Component({
  selector: 'app-activity-description-edit',
  templateUrl: './activityDescriptionEdit.component.html',
  styleUrls: ['./activityDescriptionEdit.component.scss']
})

export class ActivityDescriptionEditComponent implements OnInit{
  descriptionEdition: boolean;
  description: String = '';
  editorOptions: any;
  @Input() edit: boolean;
  @Input() type: string;

  constructor(public activityService: ActivityService, private logger: LoggerService) {

    if (this.activityService.activityLoaded.description !== 'Il n\'y a aucune description') {
      this.description = this.activityService.activityLoaded.description;
    }

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
        {name: 'clipboard', items: ['Undo', 'Redo']}
      ],
      disableNativeSpellChecker: false,
      uiColor: '#FAFAFA',
    };



    this.activityService.changes.subscribe(change => {
      //console.log('doc : ', change.doc);
      //console.log('previous : ', this.activityService.activityLoaded);
      if (change.type === 'Activity' && change.doc._id === this.activityService.activityLoaded._id && change.doc.type === 'Sequence' && this.type === 'Loaded') {
        console.log(change.doc._id, this.activityService.activityLoaded._id);
        this.description = change.doc.description;
      } else if (change.type === 'Activity' && change.doc._id === this.activityService.activityLoaded.parent && change.doc.type === 'Main' && this.type === 'Parent') {
        console.log(change.doc._id, this.activityService.activityLoaded._id);
        this.description = change.doc.description;
      }
      if (change.type === 'ChangeActivity' && this.type === 'Loaded') {
        console.log(change.type);
        this.description = change.doc.description;
      }
    });
    /*const autosave = setInterval( () => {this.saveDescription();} , 30000);*/
  }

  /**
   * Open or close text editor
   */
  switchDescription() {
      //this.description = this.activityService.activityLoaded.description;
      this.descriptionEdition = !this.descriptionEdition;
  }

  /**
   * Save the description
   */
  saveDescription(system: boolean = true) {
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
    this.saveDescription(false);
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
