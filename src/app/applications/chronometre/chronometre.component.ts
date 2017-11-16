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

  // For tests
  chronometre: any;
  timeLeft: any;
  timer: any;
  title: any;

  constructor(public databaseService: DatabaseService) {
  }

  ngOnInit(): void {
    const Stopwatch = require('timer-stopwatch');
    this.databaseService.getDocument(this.appId).then(chrono => {
      console.log(chrono);
      this.chronometre = chrono;
      this.timeLeft = this.timeInMiliSeconds(this.chronometre.timeLeft);
      this.timer = new Stopwatch(this.timeLeft, {refreshRateMS: 1000, almostDoneMS: 540000});
      this.title = this.chronometre.timeLeft;
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
    this.timer.start();
  }

  timerPause() {
    this.timer.stop();
  }

  timerReload() {
    this.timeLeft = this.timeInMiliSeconds(this.chronometre.initialTime);
    this.timer.reset(this.timeLeft);
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
