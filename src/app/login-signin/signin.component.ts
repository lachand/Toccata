import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder} from '@angular/forms';
import PouchDB from 'pouchdb';

// Dirty
declare const require: any;
PouchDB.plugin(require('pouchdb-authentication'));

import { UserService } from '../services/user.service';
import {Http, Headers} from '@angular/http';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html'
})
export class SigninComponent implements OnInit {

  signinForm: FormGroup;
  teacher: any;

  constructor(public user: UserService,
              public router: Router,
              public formBuilder: FormBuilder,
              public http: Http) {
  }

  ngOnInit() {
    this.signinForm = this.formBuilder.group({
      username: '',
      password: '',
      name: '',
      surname: '',
      avatar: 'http://mondesfrancophones.com/wp-content/Cimy_User_Extra_Fields/clarouche/Christian%20Larouche.JPG'
    });
    this.teacher = false;
  }

  signup(): void {
    if (this.signinForm.valid) {

      const headers = new Headers();
      headers.append('Content-Type', 'application/json');

      this.user.signup(this.signinForm.value.username, this.signinForm.value.password).then(result => {
        return this.user.createUser(
          this.signinForm.value.username,
          this.signinForm.value.name,
          this.signinForm.value.surname,
          this.signinForm.value.avatar,
          this.teacher
        );
      })
        .then(newUser => {
          console.log(`user created : ${newUser}`);
        })
        .catch(err => {
          console.log(`Error in signup component whith call to signup : 
          ${err}`);
        });
    }
  }

  isTeacher() {
    this.teacher = !this.teacher;
  }

}
