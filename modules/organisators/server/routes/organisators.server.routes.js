'use strict';

/**
 * Module dependencies
 */
var organisatorsPolicy = require('../policies/organisators.server.policy'),
  organisators = require('../controllers/organisators.server.controller');

module.exports = function(app) {
  // Organisators Routes
  app.route('/api/organisators').all(organisatorsPolicy.isAllowed)
    .get(organisators.list)
    .post(organisators.create);

  app.route('/api/organisators/:organisatorId').all(organisatorsPolicy.isAllowed)
    .get(organisators.read)
    .put(organisators.update)
    .delete(organisators.delete);

  // Finish by binding the Organisator middleware
  app.param('organisatorId', organisators.organisatorByID);
};
