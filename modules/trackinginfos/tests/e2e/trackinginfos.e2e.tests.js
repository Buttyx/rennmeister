'use strict';

describe('Trackinginfos E2E Tests:', function () {
  describe('Test Trackinginfos page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/trackinginfos');
      expect(element.all(by.repeater('trackinginfo in trackinginfos')).count()).toEqual(0);
    });
  });
});
