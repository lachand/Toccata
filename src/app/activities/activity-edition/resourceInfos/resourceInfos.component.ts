import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {ActivityService} from '../../../services/activity.service';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {UserService} from '../../../services/user.service';
import {ResourcesService} from '../../../services/resources.service';
import {AppsService} from 'app/services/apps.service';
import {DialogResourceEditionComponent} from "./dialogResourceEdition/dialogResourceEdition.component";
import {LoggerService} from "../../../services/logger.service";
import {isNullOrUndefined} from "util";

@Component({
  selector: 'app-resource-infos',
  templateUrl: './resourceInfos.component.html',
  styleUrls: ['./resourceInfos.component.scss']
})

export class ResourceInfosComponent implements OnInit {

  @Input() resourceId;

  resource: any;
  image: RegExp;
  text: RegExp;
  video: RegExp;
  audio: RegExp;
  document: RegExp;

  constructor(public resourcesService: ResourcesService,
              public appsService: AppsService,
              private activityService: ActivityService,
              private dialog: MatDialog,
              private logger: LoggerService,
              private ref: ChangeDetectorRef,
              public userService: UserService) {
    this.image = /image\/(?:.*)/i;
    this.text = /text\/(?:.*)/i;
    this.video = /video\/(?:.*)/i;
    this.audio = /audio\/(?:.*)/i;
    this.document = /application\/pdf/i;
  }

  ngOnInit(): void {
    this.resourcesService.getResourceInfos(this.resourceId).then(resourceInfos => {
      this.resource = resourceInfos;
    });
  }

  openRessource() {
    this.resourcesService.openResource(this.resourceId).then(resourceInfos => {
      this.resource = resourceInfos;
    });
  }

  editResource() {

    const dialogRef = this.dialog.open(DialogResourceEditionComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result.type === 'validate') {
        this.logger.log('UPDATE', this.resourceId, this.resourceId, 'change resource name');
        this.resourcesService.editName(this.resourceId, result.value).then( () =>
        {
          if (!this.ref['destroyed']) {
            this.ref.markForCheck();
          }
        });
      }
    });
  }

  deleteResource() {
    return this.activityService.deleteResource(this.resourceId);
  }
}
