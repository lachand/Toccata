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
  minimalRatio: number;
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
    this.can_connect = this.databaseService.canConnect;
    this.databaseService.dbRemote.info().then(info => {
      this.databaseService.dbSize = info.doc_count;
      this.dbSize = this.databaseService.dbSize;
    });

    setInterval(() => {
      this.databaseService.db.info().then(info => {
        this.localSize = info.doc_count;
        this.dbSize = this.databaseService.dbSize;
        this.ratio = Math.ceil(((this.localSize) / (this.dbSize - 1)) * 100);
        this.minimalRatio = Math.ceil(((this.localSize) / (this.databaseService.minimalDbSize - 1)) * 100);
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
    let isLoggedNow = false;
    setInterval( () => {
      console.log(this.minimalRatio);
    if (this.loginForm.valid && this.minimalRatio >= 90) {
      this.loading = true;
      if (this.can_connect) {
        this.userService.login(this.loginForm.value.username, this.loginForm.value.password).then((result) => {
            if (result['status'] === 401) {
              this.errorUsernamePassword = true;
            } else if (this.userService.isLoggedIn) {
              setInterval(() => {
                if (this.ratio >= 100) {
                  return this.activityService.getActivities()
                    .then(() => {
                      if (!isLoggedNow) {
                        isLoggedNow = true;
                        this.logger.initLog();
                        this.router.navigate(['../activities']);
                      }
                    });
                }
                ;
              }, 1000);
            }
          }
        );
      } else {
        this.waitForConnection = true;
      }
    }
      },1000);
  }

  goToInscription() {
    this.router.navigate(['/inscription']);
  }

}
