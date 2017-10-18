import { Component} from '@angular/core';
import {ActivityService} from '../../services/activity.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-activity-new-app',
  templateUrl: './activityNewApp.component.html'
})

  export class ActivityNewAppComponent {
  apps: any;
  activity: any;
  dialogRef: MatDialogRef<ActivityNewAppComponent>;
  applicationType: any;
  formNewApp: FormGroup;

  appsType = ['Chat', 'Feuille de calcul', 'Editeur de texte', 'Externe'];

  constructor(public activityService: ActivityService, public router: Router,
              public formBuilder: FormBuilder) {
    this.activity = activityService.activityLoaded;
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
