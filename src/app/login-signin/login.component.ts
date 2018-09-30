import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder} from '@angular/forms';
import PouchDB from 'pouchdb';

// Dirty
PouchDB.plugin(require('pouchdb-authentication'));

import { UserService } from '../services/user.service';
import {ActivityService} from '../services/activity.service';
import {DatabaseService} from '../services/database.service';
import {LoggerService} from '../services/logger.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./style-login-signin/login-signin.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading: boolean;
  hide: boolean;
  errorUsernamePassword: boolean;
  can_connect: boolean;
  errorConnexionImpossible: boolean;
  waitForConnection: boolean;
  dbSize:any;
  localSize: any;
  ratio: any;
  constructor(public userService: UserService, public router: Router,
              public formBuilder: FormBuilder,
              public activityService: ActivityService,
              public databaseService: DatabaseService,
              private logger: LoggerService) {
  }

  ngOnInit() {
    this.loading = false;
    this.errorUsernamePassword = false;
    this.errorConnexionImpossible = false;
    this.hide = true;
    this.can_connect = false;
    this.waitForConnection = false;
    this.loginForm = this.formBuilder.group({
      username: '',
      password: ''
    });
    this.databaseService.dbRemote.info().then(info => {
      this.dbSize = info.doc_count;
    });

    setInterval(() => {
      this.databaseService.db.info().then(info => {
        this.localSize = info.doc_count;
        this.ratio = Math.ceil((this.localSize / this.dbSize) * 100);
      });
    }, 1000);

    this.databaseService.changes.subscribe(changes => {
      if (changes === 'CONNEXION_IMPOSSIBLE') {
        this.errorConnexionImpossible = true;
        this.loading = false;
      }
      if (changes === 'CONNEXION_DONE') {
        this.can_connect = true;
        this.databaseService.getDocument('user_list').then(res => {
          if (this.waitForConnection) {
            this.login();
          }
        });
      }

    });
  }

  /**
   * Login a user
   */
  login(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      if (this.can_connect) {
        this.userService.login(this.loginForm.value.username, this.loginForm.value.password).then((result) => {
            if (result['status'] === 401) {
              this.errorUsernamePassword = true;
            } else if (this.userService.isLoggedIn) {
              return this.activityService.getActivities()
                .then(() => {
                  this.logger.initLog();
                  this.router.navigate(['../activities']);
                });
            }
          }
        );
      } else {
        this.waitForConnection = true;
      }
    }
  }

  goToInscription() {
    this.router.navigate(['/inscription']);
  }

}
