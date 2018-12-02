import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { ActivityService } from "../../../services/activity.service";
import { MatDialog } from "@angular/material";
import { UserService } from "../../../services/user.service";
import { ResourcesService } from "../../../services/resources.service";
import { AppsService } from "../../../services/apps.service";
import { DialogResourceEditionComponent } from "./dialogResourceEdition/dialogResourceEdition.component";
import { LoggerService } from "../../../services/logger.service";

@Component({
  selector: "app-resource-infos",
  templateUrl: "./resourceInfos.component.html",
  styleUrls: ["./resourceInfos.component.scss"]
})
export class ResourceInfosComponent implements OnInit {
  @Input() resourceId;

  resource: any;
  image: RegExp;
  text: RegExp;
  video: RegExp;
  audio: RegExp;
  document: RegExp;
  currentLoaded: boolean;

  constructor(
    public resourcesService: ResourcesService,
    public appsService: AppsService,
    private activityService: ActivityService,
    private dialog: MatDialog,
    private logger: LoggerService,
    private ref: ChangeDetectorRef,
    public userService: UserService
  ) {
    this.image = /image\/(?:.*)/i;
    this.text = /text\/(?:.*)/i;
    this.video = /video\/(?:.*)/i;
    this.audio = /audio\/(?:.*)/i;
    this.document = /application\/pdf/i;
  }

  ngOnInit(): void {
    this.resourcesService
      .getResourceInfos(this.resourceId)
      .then(resourceInfos => {
        this.resource = resourceInfos;
      });
    this.currentLoaded = (this.activityService.activityLoaded.currentElementLoaded.id === this.resourceId);
  }

  openRessource() {
    this.resourcesService
      .openResource(this.resourceId, this.activityService.activityLoaded._id)
      .then(resourceInfos => {
        this.resource = resourceInfos;
      });
  }

  editResource() {
    const dialogRef = this.dialog.open(DialogResourceEditionComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result.type === "validate") {
        this.logger.log(
          "UPDATE",
          this.resourceId,
          this.resourceId,
          "change resource name"
        );
        this.resourcesService
          .editName(this.resourceId, result.value)
          .then(() => {
            if (!this.ref["destroyed"]) {
              this.ref.detectChanges();
            }
          });
      }
    });
  }

  deleteResource() {
    this.resourcesService.getResourceInfos(this.resourceId).then(res => {
      this.activityService.deleteResource(res["id"], res["activity"]);
    });
  }
}
