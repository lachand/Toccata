import { Component} from '@angular/core';
import {ActivityService} from '../../../services/activity.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import {AppsService} from '../../../services/apps.service';

@Component({
  selector: 'app-activity-new-app',
  templateUrl: './activityNewApp.component.html'
})

  export class ActivityNewAppComponent {
  apps: any;
  appType: any;
  activity: any;
  dialogRef: MatDialogRef<ActivityNewAppComponent>;
  formNewApp: FormGroup;

  appsType = ['Chat', 'Feuille de calcul', 'Editeur de texte', 'Post-it', 'Chronomètre', 'Externe'];

  constructor(public activityService: ActivityService,
              public router: Router,
              public appsService: AppsService,
              public formBuilder: FormBuilder) {
    this.formNewApp = this.formBuilder.group({
      appName: ['', Validators.required],
      appType: ['', Validators.required],
      serviceName: '',
      url: ''
    });

    this.appType = '';
    this.activity = activityService.activityLoaded;
    this.formNewApp.valueChanges.subscribe(data => {
      this.appType = data.appType;
    });
  }

  /**
   * Create a new application and add it to current activity
   */
  newApp() {
    const appToAdd = {
      type: this.formNewApp.value.appType,
      provider: this.formNewApp.value.appType,
      name: this.formNewApp.value.appName
    };
    console.log(this.formNewApp);
    this.activityService.getActivityInfos(this.activity._id).then(activity => {
      this.appsService.createApp(appToAdd, activity['dbName']).then(() => {
        this.dialogRef.close();
      });
    });
  }

}
