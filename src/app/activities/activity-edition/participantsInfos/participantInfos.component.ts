import {Component, Input, OnInit} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'app-participant-infos',
  templateUrl: './participantInfos.component.html',
  styleUrls: ['./participantInfos.component.scss']
})

export class ParticipantInfosComponent implements OnInit {

  @Input() participantId;
  participant: any;
  avatarUrl: any;

  constructor(public userService: UserService) {
  }

  ngOnInit(): void {
    console.log(this.participantId);
    this.userService.getParticipantInfos(this.participantId).then(participant => {
        this.participant = participant;
        console.log(participant);
      }
    );
  }
}
