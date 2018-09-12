import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {AppsService} from '../../../services/apps.service';
import {ViewRef_} from '@angular/core/src/view';
import {isNullOrUndefined} from 'util';
import {LoggerService} from '../../../services/logger.service';
import {ActivityService} from '../../../services/activity.service';
import {MatDialog} from "@angular/material";
import {DialogApplicationLaunchedComponent} from "../dialogApplicationLaunched/dialogApplicationLaunched.component";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'application-launched',
  templateUrl: './applicationLaunched.component.html',
  styleUrls: ['./applicationLaunched.component.scss']
})

export class ApplicationLaunchedComponent implements OnInit {

  @Input() appId;
  application: any;
  url: any;

  constructor(public appsService: AppsService, private ref: ChangeDetectorRef,
              private logger: LoggerService, private activityService: ActivityService,
              private dialog: MatDialog, private sanitizer: DomSanitizer) {
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
    this.url = 'assets/static/component.loading.html'
    this.appsService.getApplicationInfos(this.appId).then(applicationInfos => {
      this.application = applicationInfos;
      console.log(applicationInfos);
      console.log(this.application.url);
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.application.url);
      console.log(this.url);
      this.ref.detectChanges();
    });
  }

  /**
   * Open the resource in fullscreen mode
   */
  fullscreen() {
    this.logger.log('OPEN', this.activityService.activityLoaded._id, this.appId, 'open application fullscreen');
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
    this.logger.log('CLOSE', this.activityService.activityLoaded._id, this.appId, 'close application');
    this.appsService.closeApplication(this.appId).then(applicationInfos => {
      this.application = applicationInfos;
    });
  }

  isNullOrUndefined(elmt) {
    return isNullOrUndefined(elmt);
  }

}
