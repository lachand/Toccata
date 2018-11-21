import { Component, Input, OnInit } from "@angular/core";
import { ActivityService } from "../../../services/activity.service";

@Component({
  selector: "activity-name",
  templateUrl: "./activityName.component.html"
})
export class ActivityNameComponent implements OnInit {
  activityName: any;

  @Input() activityId;

  constructor(public activityService: ActivityService) {}

  ngOnInit(): void {
    this.activityService.changes.subscribe(change => {
      if (change.doc._id === this.activityId) {
        this.activityName = change.doc.name;
      }
    });
    this.activityService.getActivityInfos(this.activityId).then(res => {
      this.activityName = res["name"];
    });
  }
}
