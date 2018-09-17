import {UserService} from './user.service';
import {DatabaseService} from './database.service';
import {getTestBed, TestBed} from '@angular/core/testing';

describe('UserService', () => {

  let userService: UserService;
  let databaseService: DatabaseService;
  let guid: String;

  beforeAll(done => {
    TestBed.configureTestingModule({
      providers: [
        DatabaseService,
        {
          deps: [
            DatabaseService,
          ],
          provide: UserService,
          useFactory: (database: DatabaseService) => {
            return new UserService(database);
          }
        }
      ]
    });

    const testbed = getTestBed();
    databaseService = testbed.get(DatabaseService);

    databaseService.changes.subscribe( change => {
      if (change === 'CONNEXION_DONE') {
        guid = databaseService.guid();
        userService = testbed.get(UserService)
        console.info(`=============================
        Passing to User service test
        =============================`);
        done();
      }
    });
  }, 1000000);

  afterAll(() => {
    userService = null;
    databaseService = null;
  });

  it('Should create a new user', done => {
    userService.createUser(`user_test_${guid}`, `${guid}`, `${guid}`, `user_test_${guid}`, `https://api.adorable.io/avatars/285/${guid}.png`, true).then((res) => {
      console.log(res);
      expect(res).toBe(`user_test_${guid}`);
      databaseService.getDocument('user_list').then(user => {
        console.log(user['userList'].indexOf(`user_test_${guid}`));
        expect(user['userList'].indexOf(`user_test_${guid}`)).toBeGreaterThanOrEqual(0);
        done();
      });
    }).catch(e => done.fail(e));
  }, 1000000);

  it('Should loged in an user', done => {
    userService.login(`user_test_${guid}`, `user_test_${guid}`).then(logged => {
      console.log(logged);
      expect(logged).toBe(true);
      done();
    });
  }, 1000000);

  it('Should check if an user is logged', done => {
    expect(userService.isLoggedIn()).toBe(true);
    done();
  }, 1000000);

  it('Should logged out an user', done => {
    userService.logout();
    expect(userService.loggedIn).toBe(false);
    expect(userService.name).toBe(null);
    expect(userService.id).toBe(null);
    expect(userService.avatar).toBe(null);
    expect(userService.fonction).toBe(null);
    expect(userService.participants).toBe(null);
    done();
  }, 1000000);

  it('Should check if an user is logged', done => {
    expect(userService.isLoggedIn()).toBe(false);
    done();
  }, 1000000);

  it('Should delete an user', done => {
    userService.deleteUser(`user_test_${guid}`).then(res => {
      databaseService.getDocument('user_list').then(user => {
        expect(user['userList'].indexOf(`user_test_${guid}`)).toBe(-1);
        done();
      });
    }).catch(e => done.fail(e));
  }, 1000000);

});
