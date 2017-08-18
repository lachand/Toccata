import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import PouchDB from 'pouchdb';

// Dirty
declare var require: any
PouchDB.plugin(require('pouchdb-authentication'));

import { UserService } from './user.service';
import { MessagesService } from './messages.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup;
  db: any;
  user: any;
  constructor(private userService: UserService, private router: Router,
              private formBuilder: FormBuilder, messagesService: MessagesService) {
    this.db = messagesService.messages_db;
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
        console.log(this.user.isLoggedIn());
        if (this.user.isLoggedIn()) {
          this.router.navigate(['chat']);
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
  onSubmit(email, password) {
    //this.userService.login(email, password).subscribe((result) => {
    //  if (result) {
    //    this.router.navigate(['']);
    //  }
    //});
  }
}
