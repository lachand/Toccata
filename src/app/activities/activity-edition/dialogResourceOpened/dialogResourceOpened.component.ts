import {ChangeDetectorRef, Component, Inject, Input, OnInit} from '@angular/core';
import {AppsService} from '../../../services/apps.service';
import {ViewRef_} from '@angular/core/src/view';
import {isNullOrUndefined} from 'util';
import {LoggerService} from '../../../services/logger.service';
import {ActivityService} from '../../../services/activity.service';
import {ResourcesService} from '../../../services/resources.service';
import {DomSanitizer} from '@angular/platform-browser';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'dialog-resource-opened',
  templateUrl: './dialogResourceOpened.component.html',
  styleUrls: ['./dialogResourceOpened.component.scss']
})

export class DialogResourceOpenedComponent implements OnInit {

  resourceId: any;
  resource: any;
  myUrl;
  el: HTMLFrameElement;
  reloaded: boolean;
  dialogRef: MatDialogRef<DialogResourceOpenedComponent>;

  /**
   * Construction of resource page
   * @param {ChangeDetectorRef} ref Detects changes on resource
   * @param {LoggerService} logger Logger for research purpose
   * @param {ActivityService} activityService Service for activity management
   * @param {ResourcesService} resourcesService Service for resources management
   * @param {DomSanitizer} sanitizer Sanitizer for creating url
   */
  constructor(private ref: ChangeDetectorRef,
              private logger: LoggerService,
              private activityService: ActivityService,
              private resourcesService: ResourcesService,
              private sanitizer: DomSanitizer,
              @Inject(MAT_DIALOG_DATA) public data: any) {

    this.resourceId = data.resourceId;

    this.resourcesService.changes.subscribe(change => {
      this.reloaded = false;
      if (this.resourceId === change.doc._id) {
        this.resource = change.doc;
        this.resource.id = change.doc._id;
        if (this.ref !== null &&
          this.ref !== undefined &&
          !(this.ref as ViewRef_).destroyed) {
          //this.ref.detectChanges();
        }
      }
    });
  }

  /**
   * Change element of iframe at loading
   * @param {Event} ev
   */
  onload(ev: Event) {
    this.el = <HTMLFrameElement>ev.srcElement;
    console.log(ev.target);
  }

  /**
   * Get informations about resource and create a page for the resource
   */
  ngOnInit(): void {
    console.log(this.resourceId);
    this.resourcesService.getResourceInfos(this.resourceId).then(resourceInfos => {
      console.log(resourceInfos);
      this.resource = resourceInfos;
      console.log(this.resource.status);
      if (this.resource.type === 'url') {
        this.myUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.resource.url);
        console.log(this.myUrl);
        this.ref.detectChanges();
      } else {
        this.resourcesService.getResourceData(this.resourceId, 'filename').then(ressource => {
          this.myUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(ressource));
          //const iframe = document.getElementById(`iframe_${this.resourceId}`);
          //console.log(iframe.document.document.body.scrollWidth/iframe.contentWindow.document.body.scrollHeight);
        });
      }
    });
  }

  /**
   * Close the fullscreen mode
   */
  fullscreen_exit() {
    this.dialogRef.close();
  }

  /**
   * Check if an element is null or undefined
   * @param elmt The element to check
   * @returns {boolean} return if an element is null or undefined (true) or not (false)
   */
  isNullOrUndefined(elmt) {
    return isNullOrUndefined(elmt);
  }

}
