import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder} from '@angular/forms';

import { UserService } from '../services/user.service';
import {ActivityService} from '../services/activity.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  constructor(private userService: UserService, private router: Router,
              private activityService: ActivityService) {
  }

  logout() {
    this.activityService.logout();
  }
}
