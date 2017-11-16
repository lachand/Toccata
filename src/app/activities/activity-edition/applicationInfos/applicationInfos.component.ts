import {Component, Input, OnInit} from '@angular/core';
import {AppsService} from '../../../services/apps.service';

@Component({
  selector: 'app-application-infos',
  templateUrl: './applicationInfos.component.html'
})

export class ApplicationInfosComponent implements OnInit {

  @Input() applicationId;
  application: any;

  constructor(public appsService: AppsService) {
  }

  ngOnInit(): void {
    this.appsService.getApplicationInfos(this.applicationId).then(applicationInfos => {
      this.application = applicationInfos;
    });
  }

  switchStatus() {
    this.appsService.switchApplicationStatus(this.applicationId).then(applicationInfos => {
      this.application = applicationInfos;
    });
  }
}
