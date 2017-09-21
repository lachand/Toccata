import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(public user: UserService) {}

  canActivate() {
    return this.user.isLoggedIn();
  }
}
