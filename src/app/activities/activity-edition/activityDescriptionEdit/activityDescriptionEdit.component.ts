import {Component, Input} from '@angular/core';
import {ActivityService} from '../../../services/activity.service';
import {LoggerService} from '../../../services/logger.service';

@Component({
  selector: 'app-activity-description-edit',
  templateUrl: './activityDescriptionEdit.component.html',
  styleUrls: ['./activityDescriptionEdit.component.scss']
})

export class ActivityDescriptionEditComponent {
  descriptionEdition: boolean;
  description: String = '';
  editorOptions: any;
  @Input() edit: boolean;

  constructor(public activityService: ActivityService, private logger: LoggerService) {
    this.descriptionEdition = false;
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
      if (change.type === 'Activity' && change.doc._id === this.activityService.activityLoaded._id) {
        console.log(change.doc._id, this.activityService.activityLoaded._id);
        this.description = change.doc.description;
      }
    });
    const autosave = setInterval( () => {this.saveDescription();} , 30000);
  }

  /**
   * Open or close text editor
   */
  switchDescription() {
    if (this.edit) {
      this.description = this.activityService.activityLoaded.description;
      this.descriptionEdition = !this.descriptionEdition;
    }
  }

  /**
   * Save the description
   */
  saveDescription() {
    if (this.descriptionEdition) {
      return this.activityService.activityEdit(this.activityService.activityLoaded._id, 'description', this.description);
    }
    else {
      return new Promise( resolve => {
        resolve(0);
      });
    }
  }

  /**
   * Change the description of an activity
   */
  changeTheDescription() {
    this.saveDescription()
      .then(() => {
        this.switchDescription();
      });
  }

}
