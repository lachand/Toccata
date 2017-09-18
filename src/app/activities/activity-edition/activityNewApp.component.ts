import { Component} from '@angular/core';
import {ActivityService} from '../../services/activity.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MdDialogRef} from '@angular/material';

@Component({
  selector: 'app-activity-new-app',
  templateUrl: './activityNewApp.component.html'
})

  export class ActivityNewAppComponent {
  apps: any;
  activity: any;
  dialogRef: MdDialogRef<ActivityNewAppComponent>;
  applicationType: any;
  formNewApp: FormGroup;

  appsType = ['Chat', 'Externe'];

  constructor(private activityService: ActivityService, private router: Router,
              private formBuilder: FormBuilder) {
    this.activity = activityService.activity_loaded;
    this.formNewApp = this.formBuilder.group({
      appName: ['', Validators.required],
      applicationType: ['', Validators.required],
      serviceName: '',
      url: ''
    });
    this.formNewApp.valueChanges.subscribe(data => {
      this.applicationType = data.applicationType;
    });
  }

  newApp() {
    let appToAdd = {};
    this.activityService.db.get(this.activity._id).then(res => {
      if (this.formNewApp.value.applicationType !== 'Externe') {
        appToAdd = {'type': this.formNewApp.value.applicationType,
          'name': this.formNewApp.value.appName,
          'status': 'unloaded',
          'activity': this.activity._id};
      } else if (this.formNewApp.value.serviceName !== '' && this.formNewApp.value.url !== '') {
        appToAdd = {'type': this.formNewApp.value.applicationType,
          'service': this.formNewApp.value.serviceName,
          'name': this.formNewApp.value.appName,
          'status': 'unloaded',
          'url': this.formNewApp.value.url,
          'activity': this.activity._id};
      }
      this.activityService.apps.createApp(appToAdd);
      this.dialogRef.close();
    });
  }

}
