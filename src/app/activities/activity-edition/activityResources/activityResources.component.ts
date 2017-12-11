import {Component, Input} from '@angular/core';
import {ActivityService} from '../../../services/activity.service';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {UserService} from '../../../services/user.service';
import {ResourcesService} from '../../../services/resources.service';
import {LoggerService} from "../../../services/logger.service";

@Component({
  selector: 'app-activity-resources',
  templateUrl: './activityResources.component.html',
  styleUrls: ['./activityResources.component.scss']
})

export class ActivityResourcesComponent {
  dialog: any;
  @Input() edit: boolean;
  image: RegExp;
  text: RegExp;
  video: RegExp;
  audio: RegExp;

  constructor(public activityService: ActivityService, public router: Router,
              public user: UserService, dialog: MatDialog,
              public resourcesService: ResourcesService,
              private logger: LoggerService) {
    this.dialog = dialog;
    this.image = /image\/(?:.*)/i;
    this.text = /text\/(?:.*)/i;
    this.video = /video\/(?:.*)/i;
    this.audio = /audio\/(?:.*)/i;
  }

  newResource() {
    document.getElementById('hiddenfile').click();
  }

  uploadResource() {
    const input = document.querySelector('input');
    const file = input.files[0];
    this.resourcesService.createResource(file, this.activityService.activityLoaded._id).then(res => {
      this.logger.log('CREATE', this.activityService.activityLoaded._id, res['_id'], 'resource created');
    });
  }

}
