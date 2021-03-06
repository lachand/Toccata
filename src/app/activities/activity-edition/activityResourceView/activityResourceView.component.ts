import { Component } from "@angular/core";
import { ResourcesService } from "../../../services/resources.service";

@Component({
  selector: "app-activity-resource-view",
  templateUrl: "./activityResourceView.component.html"
})
export class ActivityResourceViewComponent {
  resourceUrl: any;

  constructor(public resourceService: ResourcesService) {
    this.showResource("f31e4433-e569-421d-a83b-cbcc85f5e178", "logo.png");
  }

  showResource(resourceId, attachmentId) {
    this.resourceService
      .getResourceData(resourceId, attachmentId)
      .then(resource => {
        this.resourceUrl = URL.createObjectURL(resource);
      });
  }
}
