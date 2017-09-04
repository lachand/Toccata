import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder} from '@angular/forms';
import PouchDB from 'pouchdb';

// Dirty
declare const require: any;
PouchDB.plugin(require('pouchdb-authentication'));

import { UserService } from '../services/user.service';
import { MessagesService } from '../services/messages.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html'
})
export class SigninComponent implements OnInit{
  signinForm: FormGroup;
  db: any;
  user: any;
  teacher: any;
  constructor(private userService: UserService, private router: Router,
              private formBuilder: FormBuilder, messagesService: MessagesService) {
    this.db = messagesService.messages_db;
    this.user = userService;
  }

  ngOnInit() {
    this.signinForm = this.formBuilder.group({
      username: '',
      password: '',
      avatar: 'http://mondesfrancophones.com/wp-content/Cimy_User_Extra_Fields/clarouche/Christian%20Larouche.JPG'
    });
    this.teacher = false;
  }

  signup(): void {
    if (this.signinForm.valid) {
      this.db.signup(this.signinForm.value.username, this.signinForm.value.password, function (err, response) {
        if (err) {
          if (err.name === 'conflict') {
            console.log('user already exists, choose another username');
          } else if (err.name === 'forbidden') {
            console.log('invalid username');
          } else {
            console.log(err);
          }
        }
      }).then((res) => {
        console.log(res);
        let fonct = 'Eleve';
        if (this.teacher) {
          fonct = 'Enseignant';
        }
        this.db.putUser(this.signinForm.value.username, {
          metadata: {
            avatar: this.signinForm.value.avatar,
            fonction: fonct
          }
        }, function (err, response) {
          // etc.
        }).then((res2) => {
          console.log(res2);
        });
      });
    }
  }

  isTeacher() {
    this.teacher = !this.teacher;
  }

}
