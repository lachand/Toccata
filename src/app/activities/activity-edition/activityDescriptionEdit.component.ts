import {Component, Input} from '@angular/core';
import {ActivityService} from '../../services/activity.service';

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

  constructor(private activityService: ActivityService) {
    this.descriptionEdition = false;
    if (this.activityService.activity_loaded.description !== "Il n'y a aucune description") {
      this.description = this.activityService.activity_loaded.description;
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
    this.activityService.db.get(this.activityService.activity_loaded._id).then( res => {
      res.description = this.description;
      this.activityService.db.put(res).then(this.switch());
    });
  }

}
