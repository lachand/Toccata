import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {AppsService} from '../../../services/apps.service';
import {ViewRef_} from '@angular/core/src/view';
import {isNullOrUndefined} from 'util';
import {LoggerService} from '../../../services/logger.service';
import {ActivityService} from '../../../services/activity.service';
import {MatDialog} from "@angular/material";
import {DialogApplicationLaunchedComponent} from "../dialogApplicationLaunched/dialogApplicationLaunched.component";

@Component({
  selector: 'application-launched',
  templateUrl: './applicationLaunched.component.html',
  styleUrls: ['./applicationLaunched.component.scss']
})

export class ApplicationLaunchedComponent implements OnInit {

  @Input() appId;
  application: any;

  constructor(public appsService: AppsService, private ref: ChangeDetectorRef,
              private logger: LoggerService, private activityService: ActivityService,
              private dialog: MatDialog) {
    this.appsService.changes.subscribe(change => {
      if (this.appId === change.doc._id) {
        this.application = change.doc;
        this.application.id = change.doc._id;
        if (this.ref !== null &&
          this.ref !== undefined &&
          !(this.ref as ViewRef_).destroyed) {
          this.ref.detectChanges();
        }
      }
    });
  }

  ngOnInit(): void {
    this.appsService.getApplicationInfos(this.appId).then(applicationInfos => {
      this.application = applicationInfos;
    });
  }

  /**
   * Open the resource in fullscreen mode
   */
  fullscreen() {
    const dialogRef = this.dialog.open(DialogApplicationLaunchedComponent, {
      width: '100%',
      height: '100%',
      data: {
        appId: this.appId
      }
    });
    dialogRef.componentInstance.dialogRef = dialogRef;
  }

  close() {
    this.logger.log('CLOSE', this.activityService.activityLoaded._id, this.appId, 'application closed');
    this.appsService.closeApplication(this.appId).then(applicationInfos => {
      this.application = applicationInfos;
    });
  }

  isNullOrUndefined(elmt) {
    return isNullOrUndefined(elmt);
  }

}
