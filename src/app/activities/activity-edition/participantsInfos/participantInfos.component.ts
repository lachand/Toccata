import {Component, Input, OnInit} from '@angular/core';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-participant-infos',
  templateUrl: './participantInfos.component.html',
  styleUrls: ['./participantInfos.component.scss']
})

export class ParticipantInfosComponent implements OnInit {

  @Input() participantId;
  participant: any;

  constructor(public userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.getParticipantInfos(this.participantId).then(participant => {
        this.participant = participant;
      }
    );
  }
}
