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
  avatarUrl: any = '';

  constructor(public userService: UserService,
              private ref: ChangeDetectorRef,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    console.log(this.participantId);
    this.userService.getUserAvatar(this.participantId).then( (url: string) => {
      console.log('toto');
      console.log(url);
      this.avatarUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.ref.detectChanges();
    });
  }
}
