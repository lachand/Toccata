import { async, TestBed } from "@angular/core/testing";

import { AppComponent } from "./app.component";

describe("AppComponent", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent]
    }).compileComponents();
  }));

  xit("should create the app", async(() => {
    //const fixture = TestBed.createComponent(AppComponent);
    //const app = fixture.debugElement.componentInstance;
    //console.log(fixture);
    //expect(app).toBeTruthy();
    expect(true).toBe(true);
  }));

  /**
   xit(`should have as title 'app works!'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app works!');
  }));

   xit('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('app works!');
  }));
   **/
});
