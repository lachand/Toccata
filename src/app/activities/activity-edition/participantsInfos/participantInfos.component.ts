import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {isNullOrUndefined} from 'util';
import {ChangeDetectionPerfRecord} from '@angular/platform-browser/src/browser/tools/common_tools';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-participant-infos',
  templateUrl: './participantInfos.component.html',
  styleUrls: ['./participantInfos.component.scss']
})

export class ParticipantInfosComponent implements OnInit {

  @Input() participantId;
  participant: any;
  participant_name: String;
  participant_full_name: String;
  avatarUrl: any = '';
  errorWhileLoading: boolean;

  constructor(public userService: UserService,
              private ref: ChangeDetectorRef,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.errorWhileLoading = false;
    console.log(this.participantId);
    this.userService.getParticipantInfos(this.participantId).then( res => {
      this.participant = res;
      this.avatarUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.participant['url']);
        console.log(this.participant);
        this.participant_name = `${this.participant['name'][0]} ${this.participant['surname'][0]}`;
        this.participant_full_name = `${this.participant['name']} ${this.participant['surname']}`;
        this.ref.detectChanges();
    });
  }

  loadingError() {
    this.errorWhileLoading = true;
    console.log(this.errorWhileLoading);
    this.ref.detectChanges();
  }
}
