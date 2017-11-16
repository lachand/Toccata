import {Component, Input, OnInit} from '@angular/core';
import {AppsService} from '../../../services/apps.service';

@Component({
  selector: 'application-launched',
  templateUrl: './applicationLaunched.component.html'
})

export class ApplicationLaunchedComponent implements OnInit {

  @Input() appId;
  application: any;

  constructor(public appsService: AppsService) {
    this.appsService.changes.subscribe(change => {
      this.application = change.doc;
    });
  }

  ngOnInit(): void {
    this.appsService.getApplicationInfos(this.appId).then(applicationInfos => {
      this.application = applicationInfos;
    });
  }

}
