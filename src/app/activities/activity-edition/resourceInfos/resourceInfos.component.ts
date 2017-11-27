import {Component, Input, OnInit} from '@angular/core';
import {ActivityService} from '../../../services/activity.service';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {UserService} from '../../../services/user.service';
import {ResourcesService} from '../../../services/resources.service';

@Component({
  selector: 'app-resource-infos',
  templateUrl: './resourceInfos.component.html',
  styleUrls: ['./resourceInfos.component.scss']
})

export class ResourceInfosComponent implements OnInit {

  @Input() resourceId;

  resource: any;
  image: RegExp;
  text: RegExp;
  video: RegExp;
  audio: RegExp;

  constructor(public resourcesService: ResourcesService) {
    this.image = /image\/(?:.*)/i;
    this.text = /text\/(?:.*)/i;
    this.video = /video\/(?:.*)/i;
    this.audio = /audio\/(?:.*)/i;
  }

  ngOnInit(): void {
    console.log('toto');
    this.resourcesService.getResourceInfos(this.resourceId).then(resourceInfos => {
      this.resource = resourceInfos;
      console.log(this.resource);
    });
  }

  openRessource() {
    this.resourcesService.getResourceData(this.resourceId, "filename").then(ressource => {
      const myUrl = URL.createObjectURL(ressource);
      const win = window.open(myUrl, '_blank');
      win.focus();
    });
  }

}
