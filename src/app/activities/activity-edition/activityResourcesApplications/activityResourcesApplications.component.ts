import { ChangeDetectorRef, Component, ElementRef, Input } from "@angular/core";
import { ActivityService } from "../../../services/activity.service";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material";
import { UserService } from "../../../services/user.service";
import { ResourcesService } from "../../../services/resources.service";
import { LoggerService } from "../../../services/logger.service";
import { DialogNewRessourceComponent } from "../dialogNewRessource/dialognewRessource.component";
import { DialogNewResourcesApplcationsComponent } from '../dialogNewResourcesApplications/dialogNewResourcesApplcations.component';

@Component({
  selector: "app-activity-resources-applications",
  templateUrl: "./activityResourcesApplications.component.html",
  styleUrls: ["./activityResourcesApplications.component.scss"]
})
export class ActivityResourcesApplicationsComponent {
  dialog: any;
  @Input() edit: boolean;

  constructor(
    public activityService: ActivityService,
    public user: UserService,
    dialog: MatDialog,
  ) {
    this.dialog = dialog;
  }

  newElement() {
    const dialogRef = this.dialog.open(DialogNewResourcesApplcationsComponent);
  }

}
