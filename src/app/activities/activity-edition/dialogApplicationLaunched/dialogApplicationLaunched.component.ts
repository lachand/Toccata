import { ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import { AppsService } from "../../../services/apps.service";
import { ViewRef_ } from "@angular/core/src/view";
import { isNullOrUndefined } from "util";
import { LoggerService } from "../../../services/logger.service";
import { ActivityService } from "../../../services/activity.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "dialog-application-launched",
  templateUrl: "./dialogApplicationLaunched.component.html",
  styleUrls: ["./dialogApplicationLaunched.component.scss"]
})
export class DialogApplicationLaunchedComponent implements OnInit {
  appId: any;
  url: any;
  application: any;
  dialogRef: MatDialogRef<DialogApplicationLaunchedComponent>;

  constructor(
    public appsService: AppsService,
    private ref: ChangeDetectorRef,
    private logger: LoggerService,
    private activityService: ActivityService,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.appId = data.appId;

    // Change on app
    this.appsService.changes.subscribe(change => {
      if (this.appId === change.doc._id) {
        this.application = change.doc;
        this.application.id = change.doc._id;
        if (
          this.ref !== null &&
          this.ref !== undefined &&
          !(this.ref as ViewRef_).destroyed
        ) {
          this.ref.detectChanges();
        }
      }
    });

    //Change on activity (change loaded app)
    this.activityService.changes.subscribe(change => {
      if (this.activityService.activityLoaded._id === change.doc._id) {
        if (
          change.doc.currentElementLoaded.id !== this.application.id &&
          change.doc.currentElementLoaded.type === "application"
        ) {
          this.appsService
            .getApplicationInfos(this.appId)
            .then(applicationInfos => {
              this.application = applicationInfos;
              this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
                this.application.url
              );
              console.log(this.url);
            });

          //this.resource = change.doc;
          //this.resource.id = change.doc._id;
          if (
            this.ref !== null &&
            this.ref !== undefined &&
            !(this.ref as ViewRef_).destroyed
          ) {
            this.ref.detectChanges();
          }
        }
      }
    });
  }

  /**
   * Close the fullscreen mode
   */
  fullscreen_exit() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.logger.log(
      "CLOSE",
      this.activityService.activityLoaded._id,
      this.appId,
      "close application fullscreen"
    );
    this.appsService.getApplicationInfos(this.appId).then(applicationInfos => {
      this.application = applicationInfos;
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.application.url
      );
      console.log(this.url);
    });
  }

  isNullOrUndefined(elmt) {
    return isNullOrUndefined(elmt);
  }
}
