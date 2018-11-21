import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { ActivityService } from "../../../services/activity.service";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material";
import { ActivityNewAppComponent } from "../activityNewApp/activityNewApp.component";
import { AppsService } from "../../../services/apps.service";
import { UserService } from "../../../services/user.service";

@Component({
  selector: "app-activity-apps-edit",
  templateUrl: "./activityAppsEdit.component.html",
  styleUrls: ["./activityAppsEdit.component.scss"]
})
export class ActivityAppsEditComponent {
  dialog: any;
  @Input() edit: boolean;

  constructor(
    public activityService: ActivityService,
    public router: Router,
    public appsService: AppsService,
    dialog: MatDialog,
    public user: UserService,
    private ref: ChangeDetectorRef
  ) {
    this.dialog = dialog;
    console.log(user.fonction, this.edit);
    this.appsService.changes.subscribe(change => {
      this.appsService.getApplications(this.activityService.activityLoaded._id);
      if (!this.ref["destroyed"]) {
        this.ref.detectChanges();
      }
    });
  }

  newApplication() {
    const dialogRef = this.dialog.open(ActivityNewAppComponent);
    dialogRef.componentInstance.dialogRef = dialogRef;
  }

  private deleteApplication(appId) {
    this.appsService.getApplicationInfos(appId).then(app => {
      this.activityService.deleteApp(app["_id"], app["parent"]);
    });
  }
}
