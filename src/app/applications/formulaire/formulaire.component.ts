import { Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { AppsService } from "../../services/apps.service";
import { LoggerService } from "../../services/logger.service";
import { DatabaseService } from "../../services/database.service";
import { ActivityService } from "../../services/activity.service";
import { isNullOrUndefined } from "util";

@Component({
  selector: "formulaire",
  templateUrl: "./formulaire.component.html"
})
export class FormulaireComponent implements OnInit {
  public form: FormGroup;
  @Input() appId;
  name: any;
  app: any;
  unsubcribe: any;

  public fields: any;

  constructor(
    public applicationService: AppsService,
    private logger: LoggerService,
    private databaseService: DatabaseService,
    private activityService: ActivityService
  ) {
    this.form = new FormGroup({
      fields: new FormControl(JSON.stringify(this.fields))
    });

    this.form.valueChanges.subscribe(update => {
      console.log(update);
      this.fields = JSON.parse(update.fields);
    });

    this.unsubcribe = this.form.valueChanges.subscribe(update => {
      console.log(update);
      this.fields = JSON.parse(update.fields);
    });
  }

  ngOnInit(): void {
    this.applicationService.getApplication(this.appId).then(app => {
      console.log(app);
      this.app = app;
      this.name = app["name"];
      this.fields = app["json"];
    });
  }

  submit($event) {
    console.log($event, $event[0]);
    console.log(this.fields);
    this.fields.forEach(elmt => {
      console.log(elmt);
      elmt["value"] = $event[elmt["name"]];
    });
    this.app["json"] = this.fields;
    return this.applicationService.updateApplication(this.app).then(() => {
      if (this.app.blockingElement.blocking) {
        return this.applicationService.unblockApp(this.app._id).then(() => {
          return this.activityService.unblockActivity(
            this.activityService.activityLoaded._id
          );
        });
      }
    });
  }

  onUpload(e) {
    console.log(e);
  }

  getFields() {
    return this.fields;
  }

  ngDistroy() {
    this.unsubcribe();
  }

  isNullOrUndefined(elmt) {
    return isNullOrUndefined(elmt);
  }
}
