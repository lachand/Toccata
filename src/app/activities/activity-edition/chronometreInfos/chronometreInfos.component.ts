import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {AppsService} from '../../../services/apps.service';
import {MatListItem} from "@angular/material";
import {isNullOrUndefined} from "util";
import {ViewRef_} from "@angular/core/src/view";

@Component({
  selector: 'chronometre-infos',
  templateUrl: './chronometreInfos.component.html',
  styleUrls: ['chronometreInfos.component.scss']
})

export class ChronometreInfosComponent implements OnInit {

  @Input() applicationId;
  currentAppId: any;
  chronometre: any;
  timeLeft: any;
  timer: any;
  title: any;

  constructor(public appsService: AppsService,
              private ref: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.currentAppId = this.applicationId;
    const Stopwatch = require('timer-stopwatch');
    this.appsService.getApplication(this.currentAppId).then(chrono => {
      const actualTime = Date.now();
      let timeChronometer;
      this.chronometre = chrono;
      this.timeLeft = this.timeInMiliSeconds(this.chronometre.timeLeft);

      if (this.chronometre.running) {
        timeChronometer = this.timeLeft - ( actualTime - this.chronometre.startedAt);
      } else {
        timeChronometer = this.timeLeft;
      }
      this.timer = new Stopwatch(timeChronometer, {refreshRateMS: 1000});
      this.title = this.chronometre.timeLeft;

      if (this.chronometre.running) {
        this.timerStart();
      }

      this.appsService.changes.subscribe(change => {
        if (change.type === 'Chronomètre' && this.currentAppId === change.doc._id) {
          this.handleChange(change.doc);
        }
      });
    });
  }

  handleChange(change) {
    this.timer.stop();
    const actualTime = Date.now();
    let timeChronometer;
    this.chronometre = change;
    this.timeLeft = this.timeInMiliSeconds(this.chronometre.timeLeft);
    if (this.chronometre.running) {
      timeChronometer = this.timeLeft - ( actualTime - this.chronometre.startedAt);
    } else {
      timeChronometer = this.timeLeft;
    }
    this.timer.reset(this.timeLeft);
    this.title = this.chronometre.timeLeft;

    if (this.chronometre.running) {
      this.timerStart();
    }
    if (this.timeLeft < 0) {
      this.timerStop();
    }
  }

  timerStop() {
    this.appsService.getApplication(this.currentAppId).then(chronometre => {
      chronometre['running'] = false;
      chronometre['timeLeft'] = '00:00';
      this.appsService.updateApplication(chronometre);
    });
  }

  /**
   * This is a response from XerxesNoble to the post
   * https://stackoverflow.com/questions/19700283/how-to-convert-time-milliseconds-to-hours-min-sec-format-in-javascript
   * on stackoverflow
   * @param milliseconds
   * @returns {string}
   */
  parseMillisecondsIntoReadableTime(milliseconds) {
    //Get hours from milliseconds
    let hours = milliseconds / (1000 * 60 * 60);
    let absoluteHours = Math.floor(hours);
    let h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;

    //Get remainder from hours and convert to minutes
    let minutes = (hours - absoluteHours) * 60;
    let absoluteMinutes = Math.floor(minutes);
    let m = absoluteMinutes > 9 ? absoluteMinutes : '0' + absoluteMinutes;

    //Get remainder from minutes and convert to seconds
    let seconds = (minutes - absoluteMinutes) * 60;
    let absoluteSeconds = Math.floor(seconds);
    let s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;

    if (m == '00' && s != '00') {
      document.getElementById('title').className = 'blink';
    } else if (m == '00' && s == '00') {
      document.getElementById('title').className = 'blink-fast';
      this.timerStop();
    } else {
      document.getElementById('title').className = '';
    }
    return `${m}:${s}`;
  }

  timerStart() {
    this.timer.onTime((time) => {
      this.title = this.parseMillisecondsIntoReadableTime(time.ms);
      if (this.timeLeft < 0) {
        this.timerStop();
      }
      if (this.ref !== null &&
        this.ref !== undefined &&
        !(this.ref as ViewRef_).destroyed) {
        this.ref.detectChanges();
      }
    });
    if (!this.chronometre.running) {
      const startedAt = Date.now();
      console.log(this.currentAppId);
      this.appsService.getApplication(this.currentAppId).then(chronometre => {
        chronometre['startedAt'] = startedAt;
        chronometre['running'] = true;
        console.log(chronometre);
        this.appsService.updateApplication(chronometre);
      });
    }
    this.timer.start();
  }

  timeInMiliSeconds(str) {
    const p = str.split(':')
    let s = 0
    let m = 1;

    while (p.length > 0) {
      s += m * parseInt(p.pop(), 10);
      m *= 60;
    }

    return (s * 1000);
  }
}
