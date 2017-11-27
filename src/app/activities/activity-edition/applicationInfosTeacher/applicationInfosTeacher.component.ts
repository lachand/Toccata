import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {AppsService} from '../../../services/apps.service';
import {MatListItem} from "@angular/material";

@Component({
  selector: 'application-infos-teacher',
  templateUrl: './applicationInfosTeacher.component.html'
})

export class ApplicationInfosTeacherComponent implements OnInit {

  @Input() applicationId;
  application: any;
  currentLoaded: any;

  constructor(public appsService: AppsService) {
  }

  ngOnInit(): void {
    this.appsService.changes.subscribe(change => {
      if (this.applicationId === change.doc._id) {
        this.application = change.doc;
      }
    });
    this.appsService.getApplicationInfos(this.applicationId).then(applicationInfos => {
      this.application = applicationInfos;
      console.log(this.application);
    });
  }
}
