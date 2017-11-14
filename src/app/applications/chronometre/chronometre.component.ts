import {Component, ViewChild, ViewEncapsulation, OnInit} from '@angular/core';
import {AppsService} from '../../services/apps.service';
import {ActivityService} from '../../services/activity.service';
import {DatabaseService} from '../../services/database.service';
import {Stopwatch} from 'timer-stopwatch';

@Component({
  selector: 'app-chronometre',
  templateUrl: './chronometre.component.html',
  styleUrls: ['./chronometre.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ChronometreComponent {

  // For tests
  appName: any = 'application_Chronomètre_6afec131-6fc0-c38f-c87d-ad88031d76d9';
  chronometre: any;
  timeLeft: any;
  timer: any;
  hh: any;
  mm: any;
  ss: any;

  constructor(public databaseService: DatabaseService) {
    const Stopwatch = require('timer-stopwatch');
    this.databaseService.getDocument(this.appName).then(chrono => {
      console.log(chrono);
      this.chronometre = chrono;
      this.timeLeft = this.timeInMiliSeconds(this.chronometre.timeLeft);
      this.timer = new Stopwatch(this.timeLeft, {refreshRateMS: 1000, almostDoneMS: 540000});
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

    return h + ':' + m + ':' + s;
  }

  timerStart() {
    this.timer.onDone(() => {
      document.getElementById('chronometer').className = 'blink-fast';
    });
    this.timer.onTime((time) => {
      console.log(time);
      //Get hours from milliseconds
      let milliseconds = time.ms;
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

      this.hh = h;
      this.mm = m;
      this.ss = s;

      //if (h === '00' && m === '09' && s === '00') {
      if (this.mm === '09') {
        document.getElementById('chronometer').className = 'blink';
      }
      console.log(`${h}:${m}:${s}`);
    });
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

    this.hh = p[0];
    this.mm = p[1];
    this.ss = p[2];

    return (s * 1000);
  }
}
