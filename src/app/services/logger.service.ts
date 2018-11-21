import { Injectable } from "@angular/core";
import { UserService } from "./user.service";
import { DatabaseService } from "./database.service";

@Injectable()
export class LoggerService {
  logFile: Storage;
  logName: number;
  cpt: number;
  logDocument: any;
  doc: any;

  /**
   * Construct the logger
   * @param user User service to obtain user connected
   * @param database Database service used to update log file
   */
  constructor(private user: UserService, private database: DatabaseService) {
    this.logFile = window.localStorage;
  }

  /**
   * Create an empty log file for the session
   */
  initLog() {
    this.logName = Date.now();
    this.logDocument = `Log_${this.user.id}_${this.logName}`;
    this.cpt = 0;
    const doc = {
      _id: this.logDocument,
      name: `Log : ${this.logDocument}`,
      dbName: this.logDocument,
      log: `Time ; Year ; Month ; Day ; Hour ; Minutesnpm ; Seconds ; User ; Action ; Current activity ; Object ; Message ; Initiated by
      `,
      documentType: "Log"
    };
    console.log("initLog");
    this.database.addDocument(doc).then(() => {
      this.logFile.setItem(
        `${this.logDocument}_${this.cpt}`,
        `Time ; Year ; Month ; Day ; Hour ; Minutes ; Seconds ;User ; Action ; Current activity ; Object ; Message ; Initiated by`
      );
    });
    this.cpt++;
  }

  /**
   * Update the log file
   * @param actionType Type of action to write
   * @param activity Current activity
   * @param object Object of the action
   * @param message Message for the action
   * @param system Value to know if the action is initiated by the system or the user
   */
  log(actionType, activity, object, message, system: boolean = false) {
    let initiatedBy = "User";
    if (system) {
      initiatedBy = "System";
    }
    const date = new Date();
    this.database.getDocument(this.logDocument).then(res => {
      res["log"] =
        res["log"] +
        `${Date.now()} ; ${date.getUTCFullYear()} ; ${date.getUTCMonth() +
          1} ; ${date.getUTCDate()} ; ${date.getUTCHours()} ; ${date.getUTCMinutes()} ; ${date.getUTCSeconds()} ; ${
          this.user.id
        } ; ${actionType} ; ${activity} ; ${object} ; ${message} ; ${initiatedBy}
      `;
      this.database.updateDocument(res).then(() => {
        this.logFile.setItem(
          `${this.user.id}_${this.logName}_${this.cpt}`,
          `${Date.now()} ; ${date.getUTCFullYear()} ; ${date.getUTCMonth() +
            1} ; ${date.getUTCDate()} ; ${date.getUTCHours()} ; ${date.getUTCMinutes()} ; ${date.getUTCSeconds()} ; ${
            this.user.id
          } ; ${actionType} ; ${activity} ; ${object} ; ${message} ; ${initiatedBy}`
        );
        this.cpt++;
      });
    });
  }
}
