import { ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogNewRessourceComponent } from '../dialogNewRessource/dialognewRessource.component';
import { AppsService } from '../../../services/apps.service';
import { ResourcesService } from '../../../services/resources.service';
import { ActivityService } from '../../../services/activity.service';
import { LoggerService } from '../../../services/logger.service';

@Component({
  selector: "dialog-new-resources-applications",
  templateUrl: "./dialogNewResourcesApplications.component.html",
  styleUrls: ["./dialogNewResourcesApplications.component.scss"]
})
export class DialogNewResourcesApplcationsComponent {


  firstFormGroup: FormGroup;
  applicationTypeFormGroup: FormGroup;
  applicationInfosFormGroup: FormGroup;
  applicationVisibilityFormGroup: FormGroup;
  applicationBlockingFormGroup: FormGroup;
  resourceTypeFormGroup: FormGroup;
  fileFormGroup: FormGroup;
  resourceInfosFormGroup: FormGroup;
  resourceVisibilityFormGroup: FormGroup;
  elementType: any;
  fileUpload: any;
  resourceType: any;
  isOptional = false;

  constructor(private _formBuilder: FormBuilder,
              private activityService: ActivityService,
              private appsService: AppsService,
              private resourcesService: ResourcesService,
              private logger: LoggerService,
              private dialogRef: MatDialogRef<DialogNewResourcesApplcationsComponent>) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      elementType: ['', Validators.required]
    });
    this.applicationTypeFormGroup = this._formBuilder.group({
      applicationType: ['', Validators.required]
    });
    this.applicationInfosFormGroup = this._formBuilder.group({
      chronometreValue: [''],
      appName: ['', Validators.required]
    });
    this.resourceTypeFormGroup = this._formBuilder.group({
      resourceType: ['', Validators.required]
    });
    this.resourceInfosFormGroup = this._formBuilder.group({
      resourceName: ['', Validators.required],
      url: ['']
    });
    this.resourceVisibilityFormGroup = this._formBuilder.group({
      stepOrActivity: ['', Validators.required]
    });
    this.applicationVisibilityFormGroup = this._formBuilder.group({
      stepOrActivity: ['', Validators.required]
    });
    this.fileFormGroup = this._formBuilder.group({
      file: ['', Validators.required]
    });
  }

  print() {
    console.log(this.firstFormGroup.get('elementType').value);
  }

  choose(value) {
    this.applicationTypeFormGroup.patchValue({
      applicationType: value
      }
    );
  }

  onFileChange(event) {
    let reader = new FileReader();

    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      console.log(file);
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.fileFormGroup.patchValue({
          file: file
        });

        console.log(reader.result);
      };
    }
  }

  /**
   * Create a new application and add it to current activity
   */
  newApp() {
      const options = {};
      let url = "";
      if (this.applicationTypeFormGroup.get('applicationType').value === 'Chronomètre') {
        options["time"] = this.applicationInfosFormGroup.get('chronometreValue').value;
      }

      const appToAdd = {
        type: this.applicationTypeFormGroup.get('applicationType').value,
        provider: this.applicationTypeFormGroup.get('applicationType').value,
        name: this.applicationInfosFormGroup.get('appName').value,
        options: options,
        url: url
      };
      let id;
      if (this.applicationVisibilityFormGroup.get('stepOrActivity').value === "step") {
        id = this.activityService.activityLoaded._id;
      } else {
        id = this.activityService.activityLoaded.parent;
      }
      this.activityService.getActivityInfos(id).then(activity => {
        this.appsService
          .createApp(appToAdd, id, activity["dbName"])
          .then(app => {
            console.log(app);
            this.logger.log("CREATE", id, app["id"], "application created");
            if (this.applicationTypeFormGroup.get('applicationType').value === "Editeur de texte") {
              let resource = {
                _id: `ressource_${app["id"]}`,
                documentType: "Ressource application",
                application: app["id"],
                applicationType: "Editeur de texte",
                ressourceType: "Text",
                text: "",
                dbName: activity["dbName"],
                parent: activity["dbName"]
              };
              this.activityService.database.addDocument(resource).then(() => {
                this.dialogRef.close();
              });
            } else {
              this.dialogRef.close();
            }
          });
      });
    }

  newResource() {
      let id;
      if (this.resourceVisibilityFormGroup.get('stepOrActivity').value === "step") {
        id = this.activityService.activityLoaded._id;
      } else {
        id = this.activityService.activityLoaded.parent;
      }
      if (this.resourceTypeFormGroup.get('resourceType').value === "document") {
        this.resourcesService
          .createResource(this.fileFormGroup.get('file').value, id, this.resourceInfosFormGroup.get('resourceName').value)
          .then(res => {
            this.logger.log("CREATE", id, id, "resource created");
            this.dialogRef.close();
          });
      } else if (this.resourceTypeFormGroup.get('resourceType').value === "webPage") {
        const ressource = {
          name: this.resourceInfosFormGroup.get('resourceName').value,
          value: this.resourceInfosFormGroup.get('url').value,
          type: "url"
        };
        this.resourcesService
          .createResource(ressource, id, this.resourceInfosFormGroup.get('resourceName').value)
          .then(res => {
            this.logger.log("CREATE", id, id, "resource created");
            this.dialogRef.close();
          });
      }
  }

}
