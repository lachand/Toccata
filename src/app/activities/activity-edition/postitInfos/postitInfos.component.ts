import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {AppsService} from '../../../services/apps.service';
import {ActivityService} from '../../../services/activity.service';
import {isNullOrUndefined} from 'util';
import {ViewRef_} from '@angular/core/src/view';

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
          this.columns[element.state].push(element._id);
        }
      }
      this.appsService.changes.subscribe(change => {
        if (change.type === 'Post-it' && this.appId === change.doc.application) {
          this.handleChange(change.doc);
        }
      });
    });
  }

  handleChange(doc) {
    if (doc.ressourceType === 'Postit') {
      this.removeItem(doc);
      this.columns[doc.state].push(doc._id);
    }
    if (this.ref !== null &&
      this.ref !== undefined &&
      !(this.ref as ViewRef_).destroyed) {
      this.ref.detectChanges();
    }
  }

  isNullorUndefined(elmt) {
    return isNullOrUndefined(elmt);
  }

  /**
   * Only way for now to remove element (can't iterate from this.columns)
   * @param doc
   */
  removeItem(doc) {
    let index = this.columns['Backlog'].indexOf(doc._id);
    if (index !== -1) {
      this.columns['Backlog'].splice(index, 1);
    }
    index = this.columns['Backlog sprint'].indexOf(doc._id);
    if (index !== -1) {
      this.columns['Backlog sprint'].splice(index, 1);
    }
    index = this.columns['Réalisé'].indexOf(doc._id);
    if (index !== -1) {
      this.columns['Réalisé'].splice(index, 1);
    }
    index = this.columns['En cours'].indexOf(doc._id);
    if (index !== -1) {
      this.columns['En cours'].splice(index, 1);
    }
  }
}
