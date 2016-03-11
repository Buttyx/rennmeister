'use strict';

describe('Organisators E2E Tests:', function () {
  describe('Test Organisators page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/organisators');
      expect(element.all(by.repeater('organisator in organisators')).count()).toEqual(0);
    });
  });
});
