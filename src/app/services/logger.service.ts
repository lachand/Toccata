import {Injectable} from '@angular/core';
import {UserService} from "./user.service";

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

  log(actionType, object, message) {
    this.logFile.setItem(`${this.user.name}_${this.logName}_${this.cpt}`, `${Date.now()} ; ${this.user.name} ; ${actionType} ; ${object} ; ${message}`);
    this.cpt++;
  }

}
