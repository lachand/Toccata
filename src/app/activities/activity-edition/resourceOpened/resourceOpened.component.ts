import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { ViewRef_ } from "@angular/core/src/view";
import { isNullOrUndefined } from "util";
import { LoggerService } from "../../../services/logger.service";
import { ActivityService } from "../../../services/activity.service";
import { ResourcesService } from "../../../services/resources.service";
import { DomSanitizer } from "@angular/platform-browser";
import { MatDialog } from "@angular/material";
import { DialogResourceOpenedComponent } from "../dialogResourceOpened/dialogResourceOpened.component";

@Component({
  selector: "resource-opened",
  templateUrl: "./resourceOpened.component.html",
  styleUrls: ["./resourceOpened.component.scss"]
})
export class ResourceOpenedComponent implements OnInit {
  @Input() resourceId;
  resource: any;
  myUrl;
  el: HTMLFrameElement;
  reloaded: boolean;

  /**
   * Construction of resource page
   * @param {ChangeDetectorRef} ref Detects changes on resource
   * @param {LoggerService} logger Logger for research purpose
   * @param {ActivityService} activityService Service for activity management
   * @param {ResourcesService} resourcesService Service for resources management
   * @param {DomSanitizer} sanitizer Sanitizer for creating url
   */
  constructor(
    private ref: ChangeDetectorRef,
    private logger: LoggerService,
    private activityService: ActivityService,
    private resourcesService: ResourcesService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog
  ) {
    // Change on ressource
    this.resourcesService.changes.subscribe(change => {
      this.reloaded = false;
      if (this.resourceId === change.doc._id) {
        this.resource = change.doc;
        this.resource.id = change.doc._id;
        if (
          this.ref !== null &&
          this.ref !== undefined &&
          !(this.ref as ViewRef_).destroyed
        ) {
          this.ref.detectChanges();
        }
      }
    });

    //Change on activity (change loaded resource)
    this.activityService.changes.subscribe(change => {
      if (this.activityService.activityLoaded._id === change.doc._id) {
        if (
          change.doc.currentElementLoaded.id !== this.resource.id &&
          change.doc.currentElementLoaded.type === "resource"
        ) {
          this.resourcesService
            .getResourceInfos(change.doc.currentElementLoaded.id)
            .then(resourceInfos => {
              this.resource = resourceInfos;
              if (this.resource.type === "url") {
                this.myUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
                  this.resource.url
                );
                this.ref.detectChanges();
              } else {
                this.resourcesService
                  .getResourceData(this.resourceId, "filename")
                  .then(ressource => {
                    this.myUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
                      URL.createObjectURL(ressource)
                    );
                    //const iframe = document.getElementById(`iframe_${this.resourceId}`);
                    //console.log(iframe.document.document.body.scrollWidth/iframe.contentWindow.document.body.scrollHeight);
                  });
              }
            });

          //this.resource = change.doc;
          //this.resource.id = change.doc._id;
          if (
            this.ref !== null &&
            this.ref !== undefined &&
            !(this.ref as ViewRef_).destroyed
          ) {
            this.ref.detectChanges();
          }
        }
      }
    });
  }

  /**
   * Reload the component
   */
  reload() {
    let iframe = <HTMLIFrameElement>(
      document.getElementById(`iframe_${this.resourceId}`)
    );
    iframe.src = iframe.src;
  }

  /**
   * Resize an iframe
   * @param obj The iframe to resize
   */
  resizeIframe(obj) {
    if (!this.reloaded) {
      const iframe = document.getElementById(
        `iframe_${this.resourceId}`
      ) as HTMLIFrameElement;
      const ratio = (iframe.offsetHeight / iframe.offsetWidth) * 100;
      if (this.resource.type === "application/pdf") {
        iframe.style.height = "calc(100% - 64px)";
      } else if (this.resource.type === "url") {
        iframe.style.height = "calc(100% - 64px)";
        iframe.setAttribute("scrolling", "yes");
        iframe.setAttribute("src", iframe.getAttribute("src"));
        this.reloaded = true;
      } else if (this.resource.type.indexOf("video") !== -1) {
        iframe.style.height = "calc(100% - 64px)";
      } else if (this.resource.type.indexOf("image") !== -1) {
        let doc = iframe.contentDocument || iframe.contentWindow.document;
        iframe.style.height = "calc(100% - 64px)";
        doc.querySelector("img").style.height = "100%";
        doc.querySelector("img").style.maxWidth = "100%";
      }
    }
  }

  /**
   * Change element of iframe at loading
   * @param {Event} ev
   */
  onload(ev: Event) {
    this.el = <HTMLFrameElement>ev.srcElement;
  }

  /**
   * Get informations about resource and create a page for the resource
   */
  ngOnInit(): void {
    this.myUrl = "assets/static/component.loading.html";
    this.resourcesService
      .getResourceInfos(this.resourceId)
      .then(resourceInfos => {
        this.resource = resourceInfos;
        if (this.resource.type === "url") {
          this.myUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            this.resource.url
          );
          this.ref.detectChanges();
        } else {
          this.resourcesService
            .getResourceData(this.resourceId, "filename")
            .then(ressource => {
              this.myUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
                URL.createObjectURL(ressource)
              );
              //const iframe = document.getElementById(`iframe_${this.resourceId}`);
              //console.log(iframe.document.document.body.scrollWidth/iframe.contentWindow.document.body.scrollHeight);
            });
        }
      });
  }

  /**
   * Close the resource
   */
  close() {
    this.logger.log(
      "CLOSE",
      this.activityService.activityLoaded._id,
      this.resourceId,
      "close resource"
    );
    this.resourcesService.closeResource(this.resourceId).then(resourceInfos => {
      this.resource = resourceInfos;
    });
  }

  /**
   * Open the resource in fullscreen mode
   */
  fullscreen() {
    this.logger.log(
      "OPEN",
      this.activityService.activityLoaded._id,
      this.resourceId,
      "open resource fullscreen"
    );
    const dialogRef = this.dialog.open(DialogResourceOpenedComponent, {
      width: "100%",
      height: "100%",
      data: {
        resourceId: this.resourceId
      }
    });
    dialogRef.componentInstance.dialogRef = dialogRef;
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
