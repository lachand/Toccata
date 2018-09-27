import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {ActivityService} from '../../../services/activity.service';
import {LoggerService} from '../../../services/logger.service';
import {Router} from '@angular/router';

@Component({
  selector: 'activity-name-edit',
  templateUrl: './activityNameEdit.component.html',
  styleUrls: ['./activityNameEdit.component.scss']
})

export class ActivityNameEditComponent implements OnInit {
  nameEdition: boolean;
  appName: String = '';
  viewActivity: any;
  viewGroup: any;
  @Input() edit: boolean;
  @Input() activityId: string;
  @Input() type: string;

  constructor (public activityService: ActivityService, private logger: LoggerService, private router: Router, private ref: ChangeDetectorRef) {

    this.activityService.changes.subscribe(change => {
      let previousName: String;
      if ((change.type === 'Main' || change.type === 'Sequence') && change.doc._id === this.activityService.activityLoaded._id && change.doc.type === 'Sequence' && this.type === 'Loaded') {
        previousName = this.appName;
        this.appName = change.doc.name;
      } else if ((change.type === 'Main' || change.type === 'Sequence') && change.doc._id === this.activityService.activityLoaded.parent && change.doc.type === 'Main' && this.type === 'Parent') {
        previousName = this.appName;
        this.appName = change.doc.name;
      }

      if (change.type === 'ChangeActivity' && this.type === 'Loaded' && change.doc.name !== this.appName) {
        console.log(change.type);
        this.appName = change.doc.name;
      }

      if (!this.ref['destroyed'] && this.appName !== previousName) {
        this.ref.detectChanges();
      }
    });
    this.nameEdition = false;
    this.appName = '';
    this.viewActivity = '';
  }

  switch() {
    if (this.edit) {
      this.nameEdition = !this.nameEdition;
    }
  }

  /**
   * Change the name of the activity
   */
  changeTheName() {

    let id = '';

    if (this.type === 'Loaded') {
      id = this.activityService.activityLoaded._id;
    } else {
      id = this.activityService.activityLoaded.parent ;
    }

    console.log(id);

    this.activityService.activityEdit(id, 'name', this.appName)
      .then(() => {
        console.log("done");
        this.switch();
      });
  }

  focusOut(){
    this.changeTheName();
  }

  ngOnInit() {
    console.log(this);
    if (this.type === 'Loaded') {
      this.appName = this.activityService.activityLoaded.name;
      console.log(this.appName);
    } else {
      this.activityService.getActivityInfos(this.activityService.activityLoaded.parent).then(res => {
        this.appName = res['name'];
        console.log(this.appName);
      });
    }
  }

  keyPressed(ev) {
    console.log(`Pressed keyCode ${ev.key}`);
    if (ev.key === 'Enter') {
      this.changeTheName();
      ev.preventDefault();
    }
  }

}
