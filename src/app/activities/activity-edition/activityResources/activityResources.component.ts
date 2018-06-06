import {Component, ElementRef, Input, Renderer, ViewChild} from '@angular/core';
import {ActivityService} from '../../../services/activity.service';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {UserService} from '../../../services/user.service';
import {ResourcesService} from '../../../services/resources.service';
import {LoggerService} from '../../../services/logger.service';
import {DialogNewRessourceComponent} from '../dialogNewRessource/dialognewRessource.component';
import {ActivityNewRessourceComponent} from '../activityNewRessource/activityNewRessource.component';

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
              private logger: LoggerService,
              private eleRef: ElementRef) {
    this.dialog = dialog;
    this.image = /image\/(?:.*)/i;
    this.text = /text\/(?:.*)/i;
    this.video = /video\/(?:.*)/i;
    this.audio = /audio\/(?:.*)/i;
  }

  newResource() {
    const dialogRef = this.dialog.open(DialogNewRessourceComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result.type === 'File') {
        this.resourcesService.createResource(result.data, this.activityService.activityLoaded._id).then(res => {
          this.logger.log('CREATE', this.activityService.activityLoaded._id, res['_id'], 'resource created');
        });
      } else if (result.type === 'Link') {
        const dialogRefUrl = this.dialog.open(ActivityNewRessourceComponent);
        dialogRefUrl.componentInstance.dialogRef = dialogRefUrl;
      }
    });
  }

}
