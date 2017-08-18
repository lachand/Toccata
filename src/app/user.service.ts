import { Injectable } from '@angular/core';
import {MessagesService} from './messages.service';

@Injectable()
export class UserService {
  private loggedIn = false;
  db: any;
  name: any;
  id: any;

  constructor(messagesService: MessagesService) {
    this.loggedIn = false;
    this.db = messagesService.messages_db;
  }

  login(username, password) {
    return new Promise((resolve, reject) => {
      this.db.login(username, password, function (err, response) {
        if (err) {
          if (err.name === 'unauthorized') {
            console.log('name or password incorrect');
            reject(err);
          } else {
            console.log(err);
            reject(err);
          }
        }
      }).then((result) => {
        this.loggedIn = result['ok'];

        this.db.getUser(username, function (err, response) {
          if (err) {
            if (err.name === 'not_found') {
              console.log('user not found');
              reject(err);
            } else {
              console.log(err);
              reject(err);
            }
          }}).then( (res) => {
          this.name = res['name'];
          this.id = res['_id'];
          resolve(this.loggedIn);
          }
        );
        }
      );
    });
  }

  getUsername() {
    return new Promise((resolve, reject) => {
    this.db.getUser(this.name, function (err, response) {
      if (err) {
        if (err.name === 'not_found') {
          console.log('user not found');
          reject(err);
        } else {
          console.log(err);
          reject(err);
        }
      }}).then( (res) => {
        resolve(res['name']);
      }
    );
  });
  }

  getId() {
    return new Promise((resolve, reject) => {
      this.db.getUser(this.name, function (err, response) {
        if (err) {
          if (err.name === 'not_found') {
            console.log('user not found');
            reject(err);
          } else {
            console.log(err);
            reject(err);
          }
        }}).then( (res) => {
          resolve(res['_id']);
        }
      );
    });
  }

  logout() {
    this.loggedIn = false;
  }

  isLoggedIn() {
    return this.loggedIn;
  }
}
