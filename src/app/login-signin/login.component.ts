import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder} from '@angular/forms';
import PouchDB from 'pouchdb';

// Dirty
PouchDB.plugin(require('pouchdb-authentication'));

import { UserService } from '../services/user.service';
import {ActivityService} from 'app/services/activity.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading: boolean;
  errorUsernamePassword: boolean;
  constructor(public userService: UserService, public router: Router,
              public formBuilder: FormBuilder,
              public activityService: ActivityService) {
  }

  ngOnInit() {
    this.loading = false;
    this.errorUsernamePassword = false;
    this.loginForm = this.formBuilder.group({
      username: '',
      password: ''
    });
  }

  /**
   * Login a user
   */
  login(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.userService.login(this.loginForm.value.username, this.loginForm.value.password).then((result) => {
        console.log(result);
        if (result['status'] === 401) {
          this.errorUsernamePassword = true;
        } else if (this.userService.isLoggedIn()) {
            return this.activityService.getActivities().then(res => {
              return this.userService.getAllUsers();
            })
              .then(() => {
                this.router.navigate(['../activities']);
              });
          }
        }
      );
    }
  }

}
