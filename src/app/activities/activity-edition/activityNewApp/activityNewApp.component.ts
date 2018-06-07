import { Component} from '@angular/core';
import {ActivityService} from '../../../services/activity.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import {AppsService} from '../../../services/apps.service';
import {LoggerService} from '../../../services/logger.service';

@Component({
  selector: 'app-activity-new-app',
  templateUrl: './activityNewApp.component.html'
})

  export class ActivityNewAppComponent {
  apps: any;
  appType: any;
  dialogRef: MatDialogRef<ActivityNewAppComponent>;
  formNewApp: FormGroup;

  appsType = ['Post-it', 'Chronomètre', 'Editeur de texte', 'Externe'];

  constructor(public activityService: ActivityService,
              public router: Router,
              public appsService: AppsService,
              public formBuilder: FormBuilder,
              private logger: LoggerService) {
    this.formNewApp = this.formBuilder.group({
      appName: ['', Validators.required],
      appType: ['', Validators.required],
      //serviceName: '',
      chronometreValue: '',
      url: ''
    });

    this.appType = '';
    this.formNewApp.valueChanges.subscribe(data => {
      this.appType = data.appType;
    });
  }

  /**
   * Create a new application and add it to current activity
   */
  newApp() {
    // Case Chronometer
    const options = {};
    let url = '';
    if (this.formNewApp.value.appType === 'Chronomètre') {
      options['time'] = this.formNewApp.value.chronometreValue;
    } else if (this.formNewApp.value.appType === 'External') {
      url = this.formNewApp.value.url;
    }

    const appToAdd = {
      type: this.formNewApp.value.appType,
      provider: this.formNewApp.value.appType,
      name: this.formNewApp.value.appName,
      options: options,
      url: url
    };
    this.activityService.getActivityInfos(this.activityService.activityLoaded._id).then(activity => {
      this.appsService.createApp(appToAdd, this.activityService.activityLoaded._id, activity['dbName']).then((app) => {
        this.logger.log('CREATE', this.activityService.activityLoaded._id, app['_id'], 'application created');
        this.dialogRef.close();
      });
    });
  }

}
