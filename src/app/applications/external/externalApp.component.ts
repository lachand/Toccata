import {Component, Input} from '@angular/core';
import {UserService} from '../../services/user.service';
import {ActivityService} from '../../services/activity.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-externalApp',
  templateUrl: './externalApp.component.html',
  styleUrls: ['./externalApp.component.scss']
})

export class ExternalAppComponent {
  activity: ActivityService;
  user: UserService;
  appInfo: any;
  appLink: any;

  @Input() appId;

  constructor(activityService: ActivityService, userService: UserService,
              private router: Router, private route: ActivatedRoute, sanitizer: DomSanitizer) {
    this.activity = activityService;
    this.user = userService;
    this.route.params.subscribe( result => {
      this.appId = result.id;
    });
    this.appInfo = this.activity.apps.getApp(this.appId).then( res => {
      this.appInfo = res;
      this.appLink = sanitizer.bypassSecurityTrustResourceUrl(this.appInfo.url + '&userName=' + this.user.name);
    });
    }

}
