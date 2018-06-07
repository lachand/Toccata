import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {AppsService} from '../../../services/apps.service';
import {LoggerService} from '../../../services/logger.service';
import {ActivityService} from 'app/services/activity.service';
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-application-infos',
  templateUrl: './applicationInfos.component.html',
  styleUrls: ['./applicationInfos.component.scss']
})

export class ApplicationInfosComponent implements OnInit {

  @Input() applicationId;
  application: any;

  constructor(public appsService: AppsService,
              private logger: LoggerService,
              private activityService: ActivityService,
              public userService: UserService) {
  }

  ngOnInit(): void {
    this.appsService.changes.subscribe(change => {
      if (this.applicationId === change.doc._id) {
        this.application = change.doc;
      }
    });
    this.appsService.getApplicationInfos(this.applicationId).then(applicationInfos => {
      this.application = applicationInfos;
    });
  }

  deleteApp() {
    return this.appsService.deleteApp(this.applicationId);
  }

  openApplication() {
    this.logger.log('OPEN', this.activityService.activityLoaded._id, this.applicationId, 'open application');
    this.appsService.openApplication(this.applicationId).then(applicationInfos => {
      this.application = applicationInfos;
    });
  }

  switchStatus() {
    this.appsService.switchApplicationStatus(this.applicationId).then(applicationInfos => {
      this.application = applicationInfos;
    });
  }
}
