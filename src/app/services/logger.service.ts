import {Injectable} from '@angular/core';
import {UserService} from './user.service';

@Injectable()
export class LoggerService {
  logFile: Storage;
  logName: number;
  cpt: number;

  constructor(private user: UserService) {
    this.logFile = window.localStorage;
    this.logName = Date.now();
    this.cpt = 0;
  }

  initLog() {
    this.logFile.setItem(`${this.user.name}_${this.logName}_${this.cpt}`, `Time ; User ; Action ; Current activity ; Object ; Message`);
    this.cpt++;
  }

  log(actionType, activity, object, message) {
    this.logFile.setItem(`${this.user.name}_${this.logName}_${this.cpt}`,
      `${Date.now()} ; ${this.user.name} ; ${actionType} ; ${activity} ; ${object} ; ${message}`);
    this.cpt++;
  }

}
