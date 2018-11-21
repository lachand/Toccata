import { Component, OnInit } from "@angular/core";
import { ActivityService } from "../../../services/activity.service";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material";
import { AppsService } from "../../../services/apps.service";
import { LoggerService } from "../../../services/logger.service";
import { ResourcesService } from "../../../services/resources.service";

@Component({
  selector: "app-activity-new-app",
  templateUrl: "./activityNewApp.component.html",
  styleUrls: ["./activityNewApp.component.scss"]
})
export class ActivityNewAppComponent implements OnInit {
  apps: any;
  appType: any;
  dialogRef: MatDialogRef<ActivityNewAppComponent>;
  formNewApp: FormGroup;
  error: Array<any>;

  appsType = ["Chronomètre", "Editeur de texte", "Calculatrice", "Externe"];

  constructor(
    public activityService: ActivityService,
    public router: Router,
    public appsService: AppsService,
    public formBuilder: FormBuilder,
    private logger: LoggerService,
    public resourceService: ResourcesService
  ) {}

  /**
   * Reset errors array
   */
  errorReset() {
    this.error["appName"] = false;
    this.error["appType"] = false;
    this.error["stepOrActivity"] = false;
    this.error["chronometerValue"] = false;
    this.error["url"] = false;
  }

  /**
   * Check validity of form
   * @returns {boolean}
   */
  checked() {
    this.errorReset();
    let checked = true;
    if (this.formNewApp.value.appName === "") {
      this.error["appName"] = true;
      checked = false;
    }
    if (this.formNewApp.value.appType === "") {
      this.error["appType"] = true;
      checked = false;
    }
    if (this.formNewApp.value.stepOrActivity === "") {
      this.error["stepOrActivity"] = true;
      checked = false;
    }
    if (
      this.appType === "Chronomètre" &&
      this.formNewApp.value.chronometerValue === ""
    ) {
      this.error["chronometerValue"] = true;
      checked = false;
    }
    if (this.appType === "Externe" && this.formNewApp.value.url === "") {
      this.error["url"] = true;
      checked = false;
    }
    return checked;
  }

  /**
   * Create a new application and add it to current activity
   */
  newApp() {
    if (this.checked()) {
      // Case Chronometer
      const options = {};
      let url = "";
      if (this.formNewApp.value.appType === "Chronomètre") {
        options["time"] = this.formNewApp.value.chronometreValue;
      } else if (this.formNewApp.value.appType === "External") {
        console.log(this.formNewApp.value);
        url = this.formNewApp.value.url;
      }

      const appToAdd = {
        type: this.formNewApp.value.appType,
        provider: this.formNewApp.value.appType,
        name: this.formNewApp.value.appName,
        options: options,
        url: url
      };
      let id;
      if (this.formNewApp.value.stepOrActivity === "step") {
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
            if (this.formNewApp.value.appType === "Editeur de texte") {
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
  }

  ngOnInit(): void {
    this.formNewApp = this.formBuilder.group({
      appName: ["", Validators.required],
      appType: ["", Validators.required],
      stepOrActivity: ["step", Validators.required],
      //serviceName: '',
      chronometreValue: "",
      url: ""
    });

    this.appType = "";
    this.formNewApp.valueChanges.subscribe(data => {
      this.appType = data.appType;
    });

    this.error = [];
    this.errorReset();
  }
}
