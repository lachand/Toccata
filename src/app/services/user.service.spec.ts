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
      if (change.type === 'CONNEXION_DONE') {
        guid = databaseService.guid();
        userService = testbed.get(UserService)
        done();
      }
    });
  }, 1000000);

  afterAll(() => {
    userService = null;
    databaseService = null;
  });

  it('Should create a new user', done => {
    userService.createUser(`user_test_${guid}`, 'test', 'user', 'na', 'Enseignant').then((res) => {
      expect(res).toBe(`user_test_${guid}`);
      databaseService.getDocument('user_list').then(user => {
        expect(user['userList'].indexOf(`user_test_${guid}`)).toBeGreaterThanOrEqual(0);
        done();
      });
    }).catch(e => done.fail(e));
  }, 1000000);

  it('Should delete an user', done => {
    userService.deleteUser(`user_test_${guid}`).then(res => {
      databaseService.getDocument('user_list').then(user => {
        expect(user['userList'].indexOf(`user_test_${guid}`)).toBe(-1);
        done();
      });
    }).catch(e => done.fail(e));
  }, 1000000);

  xit('Should loged in an user', done => {
    userService.login('user_test', 'test_usr_paswd').then(logged => {
      expect(logged).toBe(true);
      done();
    });
  }, 1000000);

});
