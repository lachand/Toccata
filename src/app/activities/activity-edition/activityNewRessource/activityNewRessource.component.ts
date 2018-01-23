import { Component} from '@angular/core';
import {ActivityService} from '../../../services/activity.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import {AppsService} from '../../../services/apps.service';
import {LoggerService} from "../../../services/logger.service";
import {ResourcesService} from "../../../services/resources.service";

@Component({
  selector: 'app-activity-new-ressource',
  templateUrl: './activityNewRessource.component.html'
})

  export class ActivityNewRessourceComponent {
  apps: any;
  appType: any;
  dialogRef: MatDialogRef<ActivityNewRessourceComponent>;
  formNewUrl: FormGroup;
  constructor(public activityService: ActivityService,
              public router: Router,
              public resourcesService: ResourcesService,
              public formBuilder: FormBuilder,
              private logger: LoggerService) {
    this.formNewUrl = this.formBuilder.group({
      url: '',
      name: ''
    });
  }

  /**
   * Create a new url resource and add it to activity
   */
  newUrl() {
    const ressource = {
      name: this.formNewUrl.value.name,
      value: this.formNewUrl.value.url,
      type: 'url'
    };

    this.activityService.getActivityInfos(this.activityService.activityLoaded._id).then(activity => {
      this.resourcesService.createResource(ressource, this.activityService.activityLoaded._id).then((res) => {
        this.logger.log('CREATE', this.activityService.activityLoaded._id, res['_id'], 'resource created');
        this.dialogRef.close();
      });
    });
  }

  close() {
    this.dialogRef.close();
  }

}
