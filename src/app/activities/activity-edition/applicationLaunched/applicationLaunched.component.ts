import {Component, Input, OnInit} from '@angular/core';
import {AppsService} from '../../../services/apps.service';

@Component({
  selector: 'application-launched',
  templateUrl: './applicationLaunched.component.html',
  styleUrls: ['./applicationLaunched.component.scss']
})

export class ApplicationLaunchedComponent implements OnInit {

  @Input() appId;
  application: any;

  constructor(public appsService: AppsService) {
    this.appsService.changes.subscribe(change => {
      if (this.appId === change.doc._id) {
        this.application = change.doc;
      }
    });
  }

  ngOnInit(): void {
    this.appsService.getApplicationInfos(this.appId).then(applicationInfos => {
      this.application = applicationInfos;
    });
  }

  close() {
    this.appsService.closeApplication(this.appId).then(applicationInfos => {
      this.application = applicationInfos;
    });
  }

}
