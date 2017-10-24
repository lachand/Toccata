import {Component, Input} from '@angular/core';
import {ActivityService} from '../../../services/activity.service';

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

  constructor(public activityService: ActivityService) {
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
  }

  switch() {
    this.descriptionEdition = !this.descriptionEdition;
  }

  changeTheDescription() {
    this.activityService.db.get(this.activityService.activityLoaded._id).then(res => {
      res.description = this.description;
      this.activityService.db.put(res).then(this.switch());
    });
  }

}
