import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder} from '@angular/forms';
import PouchDB from 'pouchdb';

// Dirty
PouchDB.plugin(require('pouchdb-authentication'));

import { UserService } from '../services/user.service';
import {ActivityService} from 'app/services/activity.service';
import {DatabaseService} from "../services/database.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading: boolean;
  hide: boolean;
  errorUsernamePassword: boolean;
  errorConnexionImpossible: boolean
  constructor(public userService: UserService, public router: Router,
              public formBuilder: FormBuilder,
              public activityService: ActivityService,
              public databaseService: DatabaseService) {
  }

  ngOnInit() {
    this.loading = false;
    this.errorUsernamePassword = false;
    this.errorConnexionImpossible = false;
    this.hide = true;
    this.loginForm = this.formBuilder.group({
      username: '',
      password: ''
    });
    this.databaseService.changes.subscribe(changes => {
      if (changes.type === 'CONNEXION_IMPOSSIBLE') {
        this.errorConnexionImpossible = true;
        this.loading = false;
      }
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
