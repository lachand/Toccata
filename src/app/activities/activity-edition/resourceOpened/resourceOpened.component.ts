import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {AppsService} from '../../../services/apps.service';
import {ViewRef_} from "@angular/core/src/view";
import {isNullOrUndefined} from "util";
import {LoggerService} from "../../../services/logger.service";
import {ActivityService} from "../../../services/activity.service";
import {ResourcesService} from "../../../services/resources.service";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'resource-opened',
  templateUrl: './resourceOpened.component.html',
  styleUrls: ['./resourceOpened.component.scss']
})

export class ResourceOpenedComponent implements OnInit {

  @Input() resourceId;
  resource: any;
  myUrl;
  el: HTMLFrameElement;

  constructor(private ref: ChangeDetectorRef,
              private logger: LoggerService, private activityService: ActivityService, private resourcesService: ResourcesService,
              private sanitizer: DomSanitizer) {
    this.resourcesService.changes.subscribe(change => {
      console.log(change);
      if (this.resourceId === change.doc._id) {
        this.resource = change.doc;
        this.resource.id = change.doc._id;
        if (this.ref !== null &&
          this.ref !== undefined &&
          !(this.ref as ViewRef_).destroyed) {
          this.ref.detectChanges();
        }
      }
    });
  }

  resizeIframe(obj) {
    const iframe = document.getElementById(`iframe_${this.resourceId}`);
    console.log(iframe);
    const ratio = (iframe.offsetHeight / iframe.offsetWidth) * 100;
    console.log(ratio);
    if (this.resource.type === 'application/pdf') {
      iframe.style.height = '70vw';
    } else if (this.resource.type === 'url') {
      iframe.style.height = '70vw';
    } else if (this.resource.type.split('video').length > 0) {
      iframe.style.height = '30vw';
    }
  }

  onload(ev: Event) {
    this.el = <HTMLFrameElement>ev.srcElement;
    console.log(ev.target);
    console.log(ev.target);
  }

  ngOnInit(): void {
    this.resourcesService.getResourceInfos(this.resourceId).then(resourceInfos => {
      this.resource = resourceInfos;
      if (this.resource.type === 'url') {
        this.myUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.resource.url);
      } else {
        this.resourcesService.getResourceData(this.resourceId, "filename").then(ressource => {
          this.myUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(ressource));
          //const iframe = document.getElementById(`iframe_${this.resourceId}`);
          //console.log(iframe.document.document.body.scrollWidth/iframe.contentWindow.document.body.scrollHeight);
        });
      }
    });
  }

  close() {
    this.logger.log('CLOSE', this.activityService.activityLoaded._id, this.resourceId, 'resource closed');
    this.resourcesService.closeResource(this.resourceId).then(resourceInfos => {
      this.resource = resourceInfos;
    });
  }

  isNullOrUndefined(elmt) {
    return isNullOrUndefined(elmt);
  }

}
