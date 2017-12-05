import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {AppsService} from '../../../services/apps.service';
import {ViewRef_} from "@angular/core/src/view";
import {isNullOrUndefined} from "util";

@Component({
  selector: 'application-launched',
  templateUrl: './applicationLaunched.component.html',
  styleUrls: ['./applicationLaunched.component.scss']
})

export class ApplicationLaunchedComponent implements OnInit {

  @Input() appId;
  application: any;

  constructor(public appsService: AppsService, private ref: ChangeDetectorRef) {
    this.appsService.changes.subscribe(change => {
      console.log(change);
      if (this.appId === change.doc._id) {
        this.application = change.doc;
        this.application.id = change.doc._id;
        if (this.ref !== null &&
          this.ref !== undefined &&
          !(this.ref as ViewRef_).destroyed) {
          this.ref.detectChanges();
        }
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

  isNullOrUndefined(elmt) {
    return isNullOrUndefined(elmt);
  }

}
