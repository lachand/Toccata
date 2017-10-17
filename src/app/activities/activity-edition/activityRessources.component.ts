import {Component, Input} from '@angular/core';
import {ActivityService} from '../../services/activity.service';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {UserService} from '../../services/user.service';
import {RessourcesService} from '../../services/ressources.service';

@Component({
  selector: 'app-activity-ressources',
  templateUrl: './activityRessources.component.html',
  styleUrls: ['./activityRessources.component.scss']
})

export class ActivityRessourcesComponent {
  dialog: any;
  @Input() edit: boolean;
  image: RegExp;
  text: RegExp;
  video: RegExp;
  audio: RegExp;

  constructor(public activityService: ActivityService, public router: Router,
              public user: UserService, dialog: MatDialog,
              public ressourcesService: RessourcesService) {
    this.dialog = dialog;
    this.image = /image\/(?:.*)/i;
    this.text = /text\/(?:.*)/i;
    this.video = /video\/(?:.*)/i;
    this.audio = /audio\/(?:.*)/i;
  }

  newRessource() {
    document.getElementById('hiddenfile').click();
  }

  uploadRessource() {
    const input = document.querySelector('input');
    const file = input.files[0];
    this.ressourcesService.createRessource(file, this.activityService.activity_loaded._id);
  }

}
