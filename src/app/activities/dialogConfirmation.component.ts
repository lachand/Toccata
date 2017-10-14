import {Component, Inject} from '@angular/core';
import {ActivityService} from '../services/activity.service';
import {Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-dialog-confirmation',
  templateUrl: './dialogConfirmation.component.html',
})

export class DialogConfirmationComponent {
  message: String;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.message = data.message;
  }

}
