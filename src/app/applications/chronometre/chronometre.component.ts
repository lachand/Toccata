import {Component, ViewChild, ViewEncapsulation, OnInit, Input} from '@angular/core';
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

export class ChronometreComponent implements OnInit {

  @Input() appId;
  currentAppId;

  // For tests
  chronometre: any;
  timeLeft: any;
  timer: any;
  title: any;

  constructor(public databaseService: DatabaseService, public appsService: AppsService) {
  }

  ngOnInit(): void {
    this.currentAppId = this.appId;
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
    const actualTime = Date.now();
    let timeChronometer;
    this.chronometre = change;
    this.timeLeft = this.timeInMiliSeconds(this.chronometre.timeLeft);
    if (this.chronometre.running) {
      timeChronometer = this.timeLeft - ( actualTime - this.chronometre.startedAt);
    } else {
      timeChronometer = this.timeLeft;
    }
    this.timer.reset(timeChronometer);
    this.title = this.chronometre.timeLeft;
    if (this.chronometre.running) {
      this.timer.start();
    } else {
      this.timer.stop();
    }
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

    if (m === '14' && s !== '00') {
      document.getElementById('title').className = 'blink';
    } else if (m === '14' && s === '00') {
      document.getElementById('title').className = 'blink-fast';
    }

    return `${m}:${s}`;
  }

  timerStart() {
    this.timer.onTime((time) => {
      this.title = this.parseMillisecondsIntoReadableTime(time.ms);
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

  timerPause() {
    console.log(this.currentAppId);
    this.appsService.getApplication(this.currentAppId).then(chronometre => {
      chronometre['running'] = false;
      chronometre['timeLeft'] = this.parseMillisecondsIntoReadableTime(this.timeLeft - ( Date.now() - chronometre['startedAt']));
      this.appsService.updateApplication(chronometre);
    });
  }

  timerReload() {
    console.log(this.currentAppId);
    this.appsService.getApplication(this.currentAppId).then(chronometre => {
      chronometre['running'] = false;
      chronometre['timeLeft'] = chronometre['initialTime'];
      this.appsService.updateApplication(chronometre);
    });
    this.timeLeft = this.timeInMiliSeconds(this.chronometre.initialTime);
    //this.timer.reset(this.timeLeft);
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