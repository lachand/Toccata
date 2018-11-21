import { ChangeDetectorRef, Component, ElementRef, Input } from "@angular/core";
import { ActivityService } from "../../../services/activity.service";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material";
import { UserService } from "../../../services/user.service";
import { ResourcesService } from "../../../services/resources.service";
import { LoggerService } from "../../../services/logger.service";
import { DialogNewRessourceComponent } from "../dialogNewRessource/dialognewRessource.component";

@Component({
  selector: "app-activity-resources",
  templateUrl: "./activityResources.component.html",
  styleUrls: ["./activityResources.component.scss"]
})
export class ActivityResourcesComponent {
  dialog: any;
  @Input() edit: boolean;
  image: RegExp;
  text: RegExp;
  video: RegExp;
  audio: RegExp;

  constructor(
    public activityService: ActivityService,
    public router: Router,
    public user: UserService,
    dialog: MatDialog,
    public resourcesService: ResourcesService,
    private logger: LoggerService,
    private eleRef: ElementRef,
    private ref: ChangeDetectorRef
  ) {
    this.dialog = dialog;
    this.image = /image\/(?:.*)/i;
    this.text = /text\/(?:.*)/i;
    this.video = /video\/(?:.*)/i;
    this.audio = /audio\/(?:.*)/i;
    this.resourcesService.changes.subscribe(change => {
      this.resourcesService.getResources(
        this.activityService.activityLoaded._id
      );
      if (!this.ref["destroyed"]) {
        this.ref.detectChanges();
      }
    });
  }

  newResource() {
    const dialogRef = this.dialog.open(DialogNewRessourceComponent);

    dialogRef.afterClosed().subscribe(result => {
      let id;
      if (result.stepOrActivity === "step") {
        id = this.activityService.activityLoaded._id;
      } else {
        id = this.activityService.activityLoaded.parent;
      }
      if (result.type === "File") {
        this.resourcesService
          .createResource(result.data, id, result.name)
          .then(res => {
            this.logger.log("CREATE", id, id, "resource created");
          });
      } else if (result.type === "Link") {
        const ressource = {
          name: result.name,
          value: result.url,
          type: "url"
        };
        this.resourcesService
          .createResource(ressource, id, result.name)
          .then(res => {
            this.logger.log("CREATE", id, id, "resource created");
          });
      }
    });
  }
}
