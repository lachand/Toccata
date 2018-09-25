import {ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivityService} from '../../../services/activity.service';
import {LoggerService} from '../../../services/logger.service';
import {Router} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {MatStepper} from '@angular/material';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'activity-stepper',
  templateUrl: './activityStepper.component.html',
  styleUrls: ['./activityStepper.component.scss']
})

export class ActivityStepperComponent implements OnInit {

  public steps: Array<any>;
  private editable: Array<any>;
  @Input() edit: Boolean;
  @ViewChild('stepper') stepper: MatStepper;

  constructor (public activityService: ActivityService, private logger: LoggerService, private router: Router, private ref: ChangeDetectorRef, public user: UserService) {
    this.editable = [];
    if (this.activityService.activityLoaded.type === 'Main' && this.activityService.activityLoadedChild.length > 0) {
      this.steps = this.activityService.activityLoadedChild;
    } else {
      this.steps = this.activityService.sisters;
    }
    if (isNullOrUndefined(this.steps) || this.steps.length === 0) {
      this.steps = [];
    } else {
    }
    this.steps.map(elmt => {
      if (!isNullOrUndefined(this.activityService.blocked) && this.activityService.blocked.indexOf(elmt) > -1) {
        this.editable['elmt'] = false;
      } else {
        this.editable['elmt'] = true;
      }
    });
  }

  ngOnInit() {
    this.activityService.changes.subscribe(changes => {
      console.log(changes);
      if (changes.type === 'ChangeActivity') {
        if (!isNullOrUndefined(this.stepper)) {
          this.stepper.selectedIndex = this.steps.indexOf(changes.doc.currentLoaded);
        }
        this.ref.detectChanges();
      }
      console.log(changes);
      console.log(this.activityService.activityLoaded);
      if (changes.type === "Sequence" && changes.doc.parent === this.activityService.activityLoaded.parent) {
        if (this.activityService.activityLoaded.type === 'Main' && this.activityService.activityLoadedChild.length > 0) {
          this.steps = this.activityService.activityLoadedChild;
          console.log(this.steps);
        } else {
          this.steps = this.activityService.sisters;
          console.log(this.steps);
        }
        this.ref.detectChanges();
      }
      /*
      if (changes.type === "CreateStep") {
        console.log("stepCreated");
        if (this.activityService.activityLoaded.type === 'Main' && this.activityService.activityLoadedChild.length > 0) {
          this.steps = this.activityService.activityLoadedChild;
        } else {
          this.steps = this.activityService.sisters;
        }
        this.ref.detectChanges();
      }*/
      this.ref.detectChanges();
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
    let id = '';
    if (this.activityService.activityLoaded.type === 'Main') {
      id = this.activityService.activityLoaded._id;
    } else {
      id = this.activityService.activityLoaded.parent;
    }
    this.activityService.createSubActivity(id).then(res => {
      this.steps.push(res['_id']);
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
    console.log(activityId);
    this.activityService.setCurrentActivity(activityId).then(() => {
      this.activityService.load_activity(activityId).then(res => {
        this.router.navigate(['activity_view/' + activityId]);
      });
    });
  }

}
