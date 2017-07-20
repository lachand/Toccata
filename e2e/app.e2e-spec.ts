import { ABCDE.AngularPage } from './app.po';

describe('abcde.angular App', () => {
  let page: ABCDE.AngularPage;

  beforeEach(() => {
    page = new ABCDE.AngularPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
