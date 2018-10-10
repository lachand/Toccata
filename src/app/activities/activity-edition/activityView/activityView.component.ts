import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ActivityService} from '../../../services/activity.service';
import {Router} from '@angular/router';
import {MatChip, MatSnackBar, MatStepper} from '@angular/material';
import {isNullOrUndefined} from 'util';
import {AppsService} from '../../../services/apps.service';
import {Location} from '@angular/common';
import {LoggerService} from '../../../services/logger.service';
import {UserService} from '../../../services/user.service';
import {ResourcesService} from '../../../services/resources.service';

@Component({
  selector: 'app-activity-edit',
  templateUrl: './activityView.component.html',
  styleUrls: ['./activityView.component.scss']
})

export class ActivityViewComponent implements AfterViewInit, OnInit {

  steps: any;
  editActivity: any;
  editMode: boolean;
  viewGroup: any;
  editable: Array<any>;
  shareActivity: string;
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('chip') chip: MatChip;

  constructor(public activityService: ActivityService,
              public router: Router,
              public appsService: AppsService,
              public resourcesService: ResourcesService,
              private _location: Location,
              private ref: ChangeDetectorRef,
              private logger: LoggerService,
              public user: UserService,
              public snackBar: MatSnackBar) {
    this.editActivity = '';
    this.viewGroup = '';
    this.shareActivity = '';
    this.editable = [];

    setInterval( () => {
      this.snackBar.open("Pensez à remplir les traces et à sauvegarder", "Fermer");
    }
    , 300000);

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

  ngOnInit(): void {

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

    if (this.activityService.activityLoaded.master === true) {
      this.ref.detectChanges();
    }

    if (this.user.fonction === "Enseignant") {
      this.editMode = true;
    } else {
      this.editMode = false;
    }
  }

  /**
   * Change the value of the visibility of the step
   */
  switchVisibility(activityId) {
    this.activityService.switchVisibility(activityId);
  }

  switchLock(event) {
    console.log(event);
    //let index = event.path[2].id.split('cdk-step-label-0-')[1];
    event.stopPropagation();
    //this.switchVisibility(this.steps[index]);
  }

  /**
   * Set the current step to 'undefined' if the current activity is the main activity
   */
  ngAfterViewInit(): void {
    console.log(this.stepper._steps);
    if (! isNullOrUndefined(this.activityService.activityLoaded.currentLoaded) && this.steps.length > 1) {
      let activityId = this.activityService.activityLoaded.currentLoaded;

      if (this.activityService.activityLoaded.type === 'Main' && !isNullOrUndefined(activityId)) {
        this.stepper.selectedIndex = this.steps.indexOf(activityId);
        this.activityService.load_activity(activityId).then(res => {
          this.router.navigate(['activity_view/' + activityId]);
        });
      } else if (this.activityService.activityLoaded.type === 'Main' && isNullOrUndefined(activityId)) {
        this.stepper.selectedIndex = 0;
        activityId = this.steps[0];
        this.activityService.load_activity(activityId).then(res => {
          this.router.navigate(['activity_view/' + activityId]);
        });
      }
    } else {
      this.stepper.selectedIndex = 0;
    }
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

  backClicked() {
    this._location.back();
    if (this._location.path().includes('activity_view')) {
      const parts = this._location.path().split('/');
      const activityId = parts[parts.length - 1];
      this.activityService.setCurrentActivity(activityId).then(() => {
        this.activityService.load_activity(activityId).then(res => {
          this.stepper.selectedIndex = this.steps.indexOf(activityId);
          this.router.navigate(['activity_view/' + activityId]);
        });
      });
    }
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

  activityGroupShare() {
    return -1;
  }

  activityGroupView() {
    let activityId;
    if (this.activityService.activityLoaded.type === 'Sequence') {
      activityId = this.activityService.activityLoaded.parent.split('_duplicate')[0];
    } else {
      activityId = this.activityService.activityLoaded._id.split('_duplicate')[0];
    }
    this.logger.log('OPEN', activityId, activityId, 'open activity duplicates');
    this.router.navigate(['duplicates/' + activityId]);
  }

  onHovering($event: Event) {
    this.editActivity = 'Editer l\'activité';
  }

  onUnovering($event: Event) {
    this.editActivity = '';
  }

  onHoveringGroupView($event: Event) {
    this.viewGroup = 'Voir les groupes';
  }

  onUnoveringGroupView($event: Event) {
    this.viewGroup = '';
  }

  onHoveringShare($event: Event) {
    this.shareActivity = 'Partager l\'activité';
  }

  onUnoveringShare($event: Event) {
    this.shareActivity = '';
  }

  activityEdit() {
    console.log(this.activityService.activityLoaded);
    if (this.activityService.activityLoaded.type === 'Main') {
      this.router.navigate(['activity_edit/' + this.activityService.activityLoaded._id]);
    } else {
      this.logger.log('OPEN', this.activityService.activityLoaded.parent, this.activityService.activityLoaded.parent, 'open activity edition');
      this.activityService.load_activity(this.activityService.activityLoaded.parent).then(res => {
        this.router.navigate(['activity_edit/' + this.activityService.activityLoaded._id]);
      });
    }
  }
}
