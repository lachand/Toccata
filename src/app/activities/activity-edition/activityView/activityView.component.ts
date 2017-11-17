import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {ActivityService} from '../../../services/activity.service';
import {Router} from '@angular/router';
import {MatStepper} from "@angular/material";

@Component({
  selector: 'app-activity-edit',
  templateUrl: './activityView.component.html',
  styleUrls: ['./activityView.component.scss']
})

export class ActivityViewComponent implements AfterViewInit {

  steps: any;
  @ViewChild('stepper') stepper: MatStepper;

  constructor(public activityService: ActivityService,
              public router: Router) {
    if (this.activityService.activityLoaded.type === 'Main') {
      this.steps = this.activityService.activityLoadedChild;
    } else {
      this.steps = this.activityService.sisters;
    }
  }

  /**
   * Set the current step to 'undefined' if the current activity is the main activity
   */
  ngAfterViewInit(): void {
    if (this.activityService.activityLoaded.type === 'Main') {
      //this.stepper.selectedIndex = null;
    }
  }

  /**
   * Load an activity when the user clicks on a step
   * @param $event
   */
  loadActivity($event) {
    console.log($event);
    const activityId = this.steps[$event.selectedIndex];
    this.loadAnActivity(activityId);
  }

  /**
   * Load a specified activity
   * @param activityId
   */
  loadAnActivity(activityId) {
    this.activityService.load_activity(activityId).then(res => {
      this.router.navigate(['activity_view/' + activityId]);
    });
  }

}
