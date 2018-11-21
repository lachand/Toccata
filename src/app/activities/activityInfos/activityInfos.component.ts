import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { ActivityService } from "../../services/activity.service";
import { Router } from "@angular/router";
import { UserService } from "../../services/user.service";
import { LoggerService } from "../../services/logger.service";
import { isNullOrUndefined } from "util";

@Component({
  selector: "app-activity-infos",
  templateUrl: "./activityInfos.component.html",
  styleUrls: ["./activityInfos.component.scss"]
})
export class ActivityInfosComponent implements OnInit {
  @Input() activityId;
  activityInfos: any;

  constructor(
    public user: UserService,
    public activityService: ActivityService,
    public router: Router,
    private logger: LoggerService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.activityService
      .getActivityInfos(this.activityId)
      .then(activityInfos => {
        this.activityInfos = activityInfos;
      });
    this.activityService.changes.subscribe(change => {
      if (change.type === "Activity" && change.doc._id === this.activityId) {
        this.activityService
          .getActivityInfos(this.activityId)
          .then(activityInfos => {
            this.activityInfos = activityInfos;
            console.log(this.activityInfos);
            if (!this.ref["destroyed"]) {
              this.ref.detectChanges();
            }
          });
      }
    });
  }

  /**
   * Load a specific activity
   * @param activity_id
   */
  load_activity(activity_id) {
    this.logger.log("OPEN", activity_id, activity_id, "open activity view");
    this.activityService.load_activity(activity_id).then(res => {
      console.log(this.activityService.activityLoaded);
      this.router.navigate(["activity_apps/" + activity_id]);
    });
  }

  /**
   * Show a specific activity
   * @param activity_id
   */
  show_activity(activity_id) {
    if (this.activityInfos.id !== this.activityInfos.currentLoaded) {
      this.logger.log("OPEN", activity_id, activity_id, "open activity view");
      this.activityService
        .load_activity(this.activityInfos["currentLoaded"])
        .then(res => {
          console.log(this.activityService.activityLoaded);
          this.router.navigate([
            "activity_view/" + this.activityInfos["currentLoaded"]
          ]);
        });
    }
  }

  /**
   * Edit a specific activity
   * @param activity_id
   */
  edit_activity(activity_id) {
    this.logger.log("OPEN", activity_id, activity_id, "open activity edition");
    this.activityService.load_activity(activity_id).then(res => {
      this.router.navigate(["activity_edit/" + activity_id]);
    });
  }

  /**
   * Select if we load the view or the edition of a specific activity
   * @param activityId
   */
  view_or_edit(activityId) {
    if (this.user.fonction === "Enseignant") {
      this.edit_activity(activityId);
    } else {
      this.show_activity(activityId);
    }
  }

  activity_change_status(activityId, status) {
    if (this.user.fonction === "Enseignant") {
      //return this.user.setActivityStatusByTeacher(activityId, status);
    } else {
      //return this.user.setActivityStatusByStudent(activityId, status);
    }
  }

  duplicate_activity(activityId) {
    this.logger.log("CREATE", activityId, activityId, "duplicate activity");
    this.activityService.duplicateActivity(activityId, "");
  }

  deleteActivity(activityId) {
    return this.activityService.deleteActivity(activityId);
  }

  show_duplicates(activityId) {
    this.logger.log("OPEN", activityId, activityId, "open activity duplicates");
    this.router.navigate(["duplicates/" + activityId]);
  }

  isNull(elmt) {
    return isNullOrUndefined(elmt);
  }
}
