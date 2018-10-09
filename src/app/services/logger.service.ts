import {Injectable} from '@angular/core';
import {UserService} from './user.service';
import {DatabaseService} from "./database.service";

@Injectable()
export class LoggerService {
  logFile: Storage;
  logName: number;
  cpt: number;
  logDocument: any;
  doc: any;

  constructor(private user: UserService, private database: DatabaseService) {
    this.logFile = window.localStorage;
  }

  initLog() {
    this.logName = Date.now();
    this.logDocument = `Log_${this.user.name}_${this.logName}`;
    this.cpt = 0;
    let doc = {
      _id: this.logDocument,
      name: `Log : ${this.logDocument}`,
      dbName: this.logDocument,
      log: `Time ; Year ; Month ; Day ; Hour ; Minutes ; Seconds ; User ; Action ; Current activity ; Object ; Message ; Initiated by
      `,
      documentType: 'Log'
    }
    console.log("initLog");
    this.database.addDocument(doc).then( () => {
      this.logFile.setItem(`${this.logDocument}_${this.cpt}`, `Time ; Year ; Month ; Day ; Hour ; Minutes ; Seconds ;User ; Action ; Current activity ; Object ; Message ; Initiated by`);
    })
    this.cpt++;
  }

  log(actionType, activity, object, message, system: boolean = false) {
    let initiatedBy = 'User';
    if (system) {
      initiatedBy = 'System';
    }
    const date = new Date();
    this.database.getDocument(this.logDocument).then( res => {
      res['log'] = res['log'] + `${Date.now()} ; ${date.getUTCFullYear()} ; ${date.getUTCMonth()+1} ; ${date.getUTCDate()} ; ${date.getUTCHours()} ; ${date.getUTCMinutes()} ; ${date.getUTCSeconds()} ; ${this.user.name} ; ${actionType} ; ${activity} ; ${object} ; ${message} ; ${initiatedBy}
      `;
      this.database.updateDocument(res).then( () => {
        this.logFile.setItem(`${this.user.name}_${this.logName}_${this.cpt}`,
          `${Date.now()} ; ${date.getUTCFullYear()} ; ${date.getUTCMonth()+1} ; ${date.getUTCDate()} ; ${date.getUTCHours()} ; ${date.getUTCMinutes()} ; ${date.getUTCSeconds()} ; ${this.user.name} ; ${actionType} ; ${activity} ; ${object} ; ${message} ; ${initiatedBy}`);
        this.cpt++;
      });
    });
  }

}
