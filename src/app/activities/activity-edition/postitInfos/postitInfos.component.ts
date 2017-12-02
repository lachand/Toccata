import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {AppsService} from '../../../services/apps.service';
import {ActivityService} from "../../../services/activity.service";
import {isNullOrUndefined} from "util";

@Component({
  selector: 'postit-infos',
  templateUrl: './postitInfos.component.html'
})

export class PostitInfosComponent implements OnInit {

  @Input() appId;
  application: any;
  columns: any;

  constructor(public appsService: AppsService,
              public activityService: ActivityService,
              private ref: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.appsService.getRessources(this.appId).then((res: Array<any>) => {
      this.columns = [];
      this.columns['Backlog'] = [];
      this.columns['Backlog sprint'] = [];
      this.columns['Réalisé'] = [];
      this.columns['En cours'] = [];
      for (const element of res['docs']) {
        if (element.ressourceType === 'Postit') {
          this.columns[element.state].push(element);
        }
      }
      this.appsService.changes.subscribe(change => {
        if (change.type === 'Postit' && this.appId === change.doc._id) {
          this.handleChange(change.doc);
        }
      });
    });
  }

  handleChange(doc) {
    if (doc.ressourceType === 'Postit') {
      this.columns[doc.state].push(doc);
      this.ref.detectChanges();
    }
  }

  isNullorUndefined(elmt) {
    return isNullOrUndefined(elmt);
  }
}
