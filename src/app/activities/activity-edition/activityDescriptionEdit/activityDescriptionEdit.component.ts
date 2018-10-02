import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
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
  latestSaveInMinute: number;

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

      let previousDescription: String;

      if ((change.type === 'Main' || change.type === 'Sequence') && change.doc._id === this.activityService.activityLoaded._id && change.doc.type === 'Sequence' && this.type === 'Loaded') {
        console.log(change.doc._id, this.activityService.activityLoaded._id);
        previousDescription = this.description;
        this.latestSaveInMinute = 0;
        this.description = change.doc.description;
      } else if ((change.type === 'Main' || change.type === 'Sequence') && change.doc._id === this.activityService.activityLoaded.parent && change.doc.type === 'Main' && this.type === 'Parent') {
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
