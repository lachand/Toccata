import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { ActivityService } from "../../../services/activity.service";
import { LoggerService } from "../../../services/logger.service";
import { Router } from "@angular/router";
import { isNullOrUndefined } from "util";
import { UserService } from "../../../services/user.service";
import { Subscription } from "rxjs";
import { DragulaService } from "ng2-dragula";
import { DialogInformationComponent } from "../../../dialogInformation/dialogInformation.component";
import { MatDialog } from "@angular/material";

@Component({
  selector: "activity-stepper",
  templateUrl: "./activityStepper.component.html",
  styleUrls: ["./activityStepper.component.scss"]
})
export class ActivityStepperComponent implements OnInit {
  public steps: Array<any>;
  editable: Array<any>;
  subs: Subscription = new Subscription();
  @Input() edit: Boolean;
  STEPS: "STEPS";

  constructor(
    public activityService: ActivityService,
    private logger: LoggerService,
    private router: Router,
    private ref: ChangeDetectorRef,
    public user: UserService,
    private dragulaService: DragulaService,
    public dialog: MatDialog
  ) {
    this.editable = [];

    this.subs.add(
      dragulaService
        .dropModel(this.STEPS)
        .subscribe(({ el, target, source, sourceModel, targetModel, item }) => {
          this.changeStepsOrder();
        })
    );

    this.activityService.changes.subscribe(changes => {
      console.log(changes);
      console.log(this.steps);
      if (changes.type === "ChangeActivity") {
        this.ref.detectChanges();
      }
      console.log(changes);
      console.log(
        this.activityService.activityLoaded.parent,
        changes.doc._id,
        this.activityService.activityLoaded.parent === changes.doc._id,
        (changes.type === "Sequence" || changes.type === "Activity") &&
          changes.doc._id === this.activityService.activityLoaded.parent
      );
      if (
        (changes.type === "Sequence" || changes.type === "Activity") &&
        changes.doc._id === this.activityService.activityLoaded.parent
      ) {
        if (
          (changes.type === "Sequence" || changes.type === "Activity") &&
          this.activityService.activityLoadedChild.length > 0
        ) {
          //this.steps = this.activityService.activityLoadedChild;
          this.steps = changes.doc.subactivityList;
          console.log(this.steps);
        } else {
          this.steps = changes.doc.subactivityList;
          console.log(this.steps);
        }
        const tmpSteps = [];
        for (const elmt of this.steps) {
          tmpSteps.push(elmt.stepId);
        }
        this.steps = tmpSteps;
        console.log(this.steps);
        this.ref.detectChanges();
      }
      this.steps = Array.from(new Set(this.steps));
      this.ref.detectChanges();
    });
  }

  ngOnInit() {
    if (
      this.activityService.activityLoaded.type === "Main" &&
      this.activityService.activityLoadedChild.length > 0
    ) {
      this.steps = this.activityService.activityLoadedChild;
    } else {
      this.steps = this.activityService.sisters;
    }
    if (isNullOrUndefined(this.steps) || this.steps.length === 0) {
      this.steps = [];
    } else {
    }
    this.steps.map(elmt => {
      if (
        !isNullOrUndefined(this.activityService.blocked) &&
        this.activityService.blocked.indexOf(elmt) > -1
      ) {
        this.editable["elmt"] = false;
      } else {
        this.editable["elmt"] = true;
      }
    });
  }

  /**
   * Change the value of the visibility of the step
   */
  switchVisibility(activityId) {
    this.activityService.switchVisibility(activityId);
  }

  switchLock(event) {
    console.log(event);
    event.stopPropagation();
  }

  addStep() {
    let id = "";
    if (this.activityService.activityLoaded.type === "Main") {
      id = this.activityService.activityLoaded._id;
    } else {
      id = this.activityService.activityLoaded.parent;
    }
    this.activityService.createSubActivity(id).then(res => {
      this.steps.push(res["_id"]);
    });
  }

  /**
   * Load an activity when the user clicks on a step
   * @param $event
   */
  loadActivity($event) {
    const activityId = this.steps[$event.selectedIndex];
    console.log(activityId);
    this.loadAnActivity(activityId);
  }

  /**
   * Load a specified activity
   * @param activityId
   */
  loadAnActivity(activityId) {
    //console.log(this.steps);
    //console.log(this.steps.indexOf(this.activityService.activityLoaded._id), this.steps.indexOf(activityId));
    //console.log(this.activityService.activityLoaded);
    if (
      this.steps.indexOf(this.activityService.activityLoaded._id) <
        this.steps.indexOf(activityId) &&
      (!isNullOrUndefined(this.activityService.activityLoaded["blockingStep"]) && this.activityService.activityLoaded["blockingStep"].blocked) &&
      this.user.fonction !== 'Enseignant'
    ) {
      console.log("L'étape est bloquée");
      const dialogRef = this.dialog.open(DialogInformationComponent, {
        data: {
          message:
            "L'étape est bloquée, vous devez remplir le questionnaire pour changer d'étape"
        }
      });
    } else {
      this.activityService.setCurrentActivity(activityId).then(() => {
        this.activityService.load_activity(activityId).then(res => {
          this.router.navigate(["activity_view/" + activityId]);
        });
      });
    }
    /*
    this.activityService.setCurrentActivity(activityId).then(() => {
      this.activityService.load_activity(activityId).then(res => {
        this.router.navigate(['activity_view/' + activityId]);
      });
    });
    */
  }

  changeStepsOrder() {
    const activities = [];
    this.activityService
      .getActivityInfos(this.activityService.activityLoaded.parent)
      .then(activity => {
        for (const subActivity of this.steps) {
          for (const elm of activity["subactivityList"]) {
            if (subActivity === elm["stepId"]) {
              activities.push(elm);
            }
          }
        }
        this.activityService.activityEdit(
          this.activityService.activityLoaded.parent,
          "subactivityList",
          activities
        );
      });
  }
}
