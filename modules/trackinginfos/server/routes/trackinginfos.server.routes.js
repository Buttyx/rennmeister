'use strict';

/**
 * Module dependencies
 */
var trackinginfosPolicy = require('../policies/trackinginfos.server.policy'),
  trackinginfos = require('../controllers/trackinginfos.server.controller');

module.exports = function(app) {
  // Trackinginfos Routes
  app.route('/api/trackinginfos').all(trackinginfosPolicy.isAllowed)
    .get(trackinginfos.list)
    .post(trackinginfos.create);

  app.route('/api/trackinginfos/:trackinginfoId').all(trackinginfosPolicy.isAllowed)
    .get(trackinginfos.read)
    .put(trackinginfos.update)
    .delete(trackinginfos.delete);

  // Finish by binding the Trackinginfo middleware
  app.param('trackinginfoId', trackinginfos.trackinginfoByID);
};
