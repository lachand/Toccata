import {Component, Input, OnInit} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {AppsService} from '../../services/apps.service';
import {LoggerService} from '../../services/logger.service';
import {DatabaseService} from '../../services/database.service';
import {ActivityService} from '../../services/activity.service';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'formulaire',
  templateUrl: './formulaire.component.html'
})
export class FormulaireComponent implements OnInit {
  public form: FormGroup;
  @Input() appId;
  name: any;
  unsubcribe: any

  public fields: any;

  constructor(public applicationService: AppsService,
              private logger: LoggerService,
              private databaseService: DatabaseService,
              private activityService: ActivityService) {
    this.form = new FormGroup({
      fields: new FormControl(JSON.stringify(this.fields))
    })
    this.unsubcribe = this.form.valueChanges.subscribe((update) => {
      console.log(update);
      this.fields = JSON.parse(update.fields);
    });
  }

  ngOnInit(): void {

    this.applicationService.getApplication(this.appId).then(app => {
      console.log(app);
      this.name = app['name'];
      this.fields = app['json'];
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
