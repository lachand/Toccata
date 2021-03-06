import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "../services/user.service";
import { ActivityService } from "../services/activity.service";
import { Location } from "@angular/common";
import { isNullOrUndefined } from "util";
import { DatabaseService } from "../services/database.service";
import {
  isFullScreen,
  toggleFullScreen as fullScreen
} from "../../interfaces/fullscreen.interface";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"]
})
export class MenuComponent {
  fullscreen: boolean;
  viewGroup: string;

  constructor(
    public userService: UserService,
    public router: Router,
    public activityService: ActivityService,
    public databaseService: DatabaseService,
    private _location: Location
  ) {
    this.fullscreen = isFullScreen();
    this.viewGroup = "";
  }

  activityGroupView() {
    let activityId;
    if (this.activityService.activityLoaded.type === "Sequence") {
      activityId = this.activityService.activityLoaded.parent.split(
        "_duplicate"
      )[0];
    } else {
      activityId = this.activityService.activityLoaded._id.split(
        "_duplicate"
      )[0];
    }
    //this.logger.log('OPEN', activityId, activityId, 'open activity duplicates');
    this.router.navigate(["duplicates/" + activityId]);
  }

  onHoveringGroupView($event: Event) {
    this.viewGroup = "Voir les groupes";
  }

  onUnoveringGroupView($event: Event) {
    this.viewGroup = "";
  }

  logout() {
    this.activityService.logout();
    this.router.navigate(["/login"]);
  }

  isNullOrUndefined(elmt) {
    return isNullOrUndefined(elmt);
  }

  fullScreen() {
    fullScreen();
    this.fullscreen = !this.fullscreen;
  }

  goToMyActivities() {
    this.activityService.unloadActivity();
    this.router.navigate(["activities"]);
  }

  goToGroups() {
    const activityId = this.activityService.activityLoaded.masterActivity;
    this.activityService.getActivityInfos(activityId).then(activity => {
      this.activityService
        .setCurrentActivity(activity["currentLoaded"])
        .then(() => {
          this.activityService
            .load_activity(activity["currentLoaded"])
            .then(res => {
              this.router.navigate(["duplicates/" + activity["currentLoaded"]]);
            });
        });
    });
  }

  goToActivity() {
    this.router.navigate([
      "activity_view/" + this.activityService.activityLoaded.id
    ]);
  }

  backClicked() {
    this._location.back();
    if (this._location.path().includes("activity_view")) {
      const parts = this._location.path().split("/");
      const activityId = parts[parts.length - 1];
      this.activityService.setCurrentActivity(activityId).then(() => {
        this.activityService.load_activity(activityId).then(res => {
          this.router.navigate(["activity_view/" + activityId]);
        });
      });
    }
  }
}
