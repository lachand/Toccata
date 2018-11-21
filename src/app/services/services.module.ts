import { NgModule } from "@angular/core";
import { UserService } from "./user.service";
import { ActivityService } from "./activity.service";
import { LoggedInGuard } from "../verifications/logged-in.guards";
import { AppsService } from "./apps.service";
import { LoggerService } from "./logger.service";
import { DatabaseService } from "./database.service";
import { ResourcesService } from "./resources.service";

@NgModule({
  providers: [
    UserService,
    ActivityService,
    ResourcesService,
    LoggedInGuard,
    AppsService,
    DatabaseService,
    LoggerService
  ]
})
export class ServicesModule {}
