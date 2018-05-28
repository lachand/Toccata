import {UserService} from './user.service';
import {DatabaseService} from './database.service';
import {AppsService} from './apps.service';
import {ResourcesService} from './resources.service';
import {ActivityService} from './activity.service';
import {BaseRequestOptions, Http} from '@angular/http';
import {LoggerService} from './logger.service';
import {getTestBed, TestBed} from '@angular/core/testing';
import { MockBackend, MockConnection} from '@angular/http/testing';

describe('UserService', () => {

  let databaseService: DatabaseService;
  let activityService: ActivityService;
  let userService: UserService;
  let activityId;

  beforeAll(done => {
    TestBed.configureTestingModule({
      providers: [
        DatabaseService,
        MockBackend,
        BaseRequestOptions,
        {
          deps: [
            DatabaseService,
          ],
          provide: UserService,
          useFactory: (database: DatabaseService) => {
            return new UserService(database);
          }
        },
        {
          deps: [
            UserService,
          ],
          provide: LoggerService,
          useFactory: (user: UserService) => {
            return new LoggerService(user);
          }
        },
        {
          deps: [
            MockBackend,
            BaseRequestOptions
          ],
          provide: Http,
          useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          }
        },
        {
          deps: [
            DatabaseService,
            Http
          ],
          provide: AppsService,
          useFactory: (/**http: Http,**/ database: DatabaseService) => {
            return new AppsService(/**http,**/ database);
          }
        },
        {
          deps: [
            DatabaseService,
            LoggerService
          ],
          provide: ResourcesService,
          useFactory: (database: DatabaseService, logger: LoggerService) => {
            return new ResourcesService(database, logger);
          }
        },
        {
          deps: [
            UserService,
            ResourcesService,
            DatabaseService,
            AppsService
          ],
          provide: ActivityService,
          useFactory: (user: UserService, resources: ResourcesService, database: DatabaseService, apps: AppsService) => {
            return new ActivityService(user, resources, database, apps);
          }
        }
      ]
    });

    const testbed = getTestBed();
    databaseService = testbed.get(DatabaseService);

    databaseService.changes.subscribe( change => {
        if (change.type === 'CONNEXION_DONE') {
          userService = testbed.get(UserService);
          userService.login('usertest', 'usertest').then(res => {
            activityService = testbed.get(ActivityService);
            done();
          });
        }
      });
  }, 1000000);

  it('Should create a new activity', done => {
    activityService.createActivity('Main').then((res) => {
      activityId = res;
      databaseService.getDocument(activityId).then(activity => {
        expect(activity['userList'].indexOf(`usertest`)).toBeGreaterThanOrEqual(0);
        done();
      });
    }).catch(e => done.fail(e));
  }, 1000000);

  it('Should delete a new activity', done => {
    activityService.delete_activity(activityId).then((activity) => {
      databaseService.getDocument(activityId).then(res => {
        expect(res['ok']).toBe(false);
        done();
      });
    }).catch(e => done.fail(e));
  }, 1000000);

  afterAll(() => {
    databaseService = null;
    activityService = null;
  });


});
