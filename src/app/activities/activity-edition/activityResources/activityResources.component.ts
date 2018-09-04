import {ChangeDetectorRef, Component, ElementRef, Input, Renderer, ViewChild} from '@angular/core';
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
              private eleRef: ElementRef,
              private ref: ChangeDetectorRef) {
    this.dialog = dialog;
    this.image = /image\/(?:.*)/i;
    this.text = /text\/(?:.*)/i;
    this.video = /video\/(?:.*)/i;
    this.audio = /audio\/(?:.*)/i;
    this.resourcesService.changes.subscribe(change => {
      console.log("new resource");
      this.resourcesService.getResources(this.activityService.activityLoaded._id)
      if (!this.ref['destroyed']) {
        this.ref.detectChanges();
      }
    });
  }

  newResource() {
    const dialogRef = this.dialog.open(DialogNewRessourceComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result.type === 'File') {
        let id;
        if (result.stepOrActivity === 'step') {
          id = this.activityService.activityLoaded._id;
        } else {
          id = this.activityService.activityLoaded.parent;
        }
        this.resourcesService.createResource(result.data, id).then(res => {
          this.logger.log('CREATE', id, id, 'resource created');
        });
      } else if (result.type === 'Link') {
        const dialogRefUrl = this.dialog.open(ActivityNewRessourceComponent, {data: result.stepOrActivity});
        dialogRefUrl.componentInstance.dialogRef = dialogRefUrl;
      }
    });
  }

}
