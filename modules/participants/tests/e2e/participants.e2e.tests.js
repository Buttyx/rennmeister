'use strict';

describe('Participants E2E Tests:', function () {
  describe('Test Participants page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/participants');
      expect(element.all(by.repeater('participant in participants')).count()).toEqual(0);
    });
  });
});
