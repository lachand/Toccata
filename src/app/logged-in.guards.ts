import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from './user.service';

@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(private user: UserService) {}

  canActivate() {
    return this.user.isLoggedIn();
  }
}
