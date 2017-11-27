import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {AppsService} from '../../../services/apps.service';

@Component({
  selector: 'app-application-infos',
  templateUrl: './postitInfos.component.html',
  styleUrls: ['./applicationInfos.component.scss']
})

export class PostitInfosComponent implements OnInit {

  @Input() applicationId;
  application: any;

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
    });
  }

  openApplication() {
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
