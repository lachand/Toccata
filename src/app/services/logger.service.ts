import {Injectable} from '@angular/core';

@Injectable()
export class LoggerService {
  logFile: Storage;
  logName: number;

  constructor() {
    this.logFile = window.localStorage;
    this.logName = Date.now();
  }

  log(user, actionType, object, message) {
    this.logFile.setItem(`${user}_${this.logName}`, `${Date.now()} ; ${user} ; ${actionType} ; ${object} ; ${message}`);
  }

}
