import { DatabaseService } from "./database.service";
import { getTestBed, TestBed } from "@angular/core/testing";

describe("DatabaseService", () => {
  let database: DatabaseService;

  beforeAll(done => {
    TestBed.configureTestingModule({
      providers: [DatabaseService]
    });

    const testbed = getTestBed();
    database = testbed.get(DatabaseService);

    database.changes.subscribe(change => {
      console.log(change);
      if (change === "CONNEXION_DONE") {
        done();
      }
    });
  }, 1000000);

  afterEach(() => {
    database = null;
  });

  it("Should get the userList document", done => {
    database
      .getDocument("user_list")
      .then(res => {
        expect(res["_id"]).toBe("user_list");
        done();
      })
      .catch(e => done.fail(e));
  }, 1000000);
});
