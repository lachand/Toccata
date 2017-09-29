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
  db: any;
  user: any;
  constructor(public userService: UserService, public router: Router,
              public formBuilder: FormBuilder,
              public activityService: ActivityService) {
    this.db = userService.db;
    this.user = userService;
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: '',
      password: ''
    });
  }

  login(): void {
    if (this.loginForm.valid) {
      this.user.login(this.loginForm.value.username, this.loginForm.value.password).then( (result) => {
        if (this.user.isLoggedIn()) {
          this.activityService.getActivities().then( res => {
            console.log("debug");
            console.log(this.router.navigate(['../activities']));
          });
        }
        }
      );
    }
  }

  signup(): void {
    if (this.loginForm.valid) {
      this.db.signup(this.loginForm.value.username, this.loginForm.value.password, function (err, response) {
        if (err) {
          if (err.name === 'conflict') {
            console.log('user already exists, choose another username');
          } else if (err.name === 'forbidden') {
            console.log('invalid username');
          } else {
            console.log(err);
          }
        }
      });
    }
  }

}
