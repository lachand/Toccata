import {Component, Inject} from '@angular/core';
import {ActivityService} from '../../../services/activity.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AppsService} from '../../../services/apps.service';
import {LoggerService} from '../../../services/logger.service';
import {ResourcesService} from '../../../services/resources.service';

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
              private logger: LoggerService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.formNewUrl = this.formBuilder.group({
      url: '',
      name: ''
    });
    console.log(data);
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

    let id;
    if (this.data === 'step') {
      id = this.activityService.activityLoaded._id;
    } else {
      id = this.activityService.activityLoaded.parent;
    }

    this.activityService.getActivityInfos(id).then(activity => {
      this.resourcesService.createResource(ressource, id).then((res) => {
        this.logger.log('CREATE', id, id, 'resource created');
        this.dialogRef.close();
      });
    });
  }

  close() {
    this.dialogRef.close();
  }

}
