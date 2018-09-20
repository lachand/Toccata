import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {ActivityService} from '../../../services/activity.service';
import {LoggerService} from '../../../services/logger.service';

@Component({
  selector: 'app-notes',
  templateUrl: './appNotes.component.html',
  styleUrls: ['./appNotes.component.scss']
})

export class AppNotesComponent implements OnInit {
  notesEdition: boolean;
  notes: String = '';
  editorOptions: any;
  @Input() edit: boolean;

  constructor(public activityService: ActivityService,
              private logger: LoggerService,
              private ref: ChangeDetectorRef) {

    if (this.activityService.activityLoaded.notes !== '') {
      this.notes = this.activityService.activityLoaded.notes;
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
      if (change.doc._id === this.activityService.activityLoaded._id) {
        this.notes = change.doc.notes;
      }
      if (!this.ref['destroyed']) {
        this.ref.detectChanges();
      }
    });
  }

  /**
   * Open or close text editor
   */
  switchNotes() {
      this.notesEdition = !this.notesEdition;
  }

  /**
   * Save the description
   */
  saveNotes(system: boolean = true) {
    if (this.notesEdition) {
      this.notesEdition = !this.notesEdition;
      return this.activityService.activityEdit(this.activityService.activityLoaded._id, 'notes', this.notes, system);
    } else {
      this.notesEdition = !this.notesEdition;
      return new Promise( resolve => {
        resolve(0);
      });
    }
  }

  /**
   * Change the description of an activity
   */
  changeTheNotes() {
    this.saveNotes(false);
  }

  ngOnInit(): void {
    this.notesEdition = false;
    this.notes = this.activityService.activityLoaded.notes;
  }
}
