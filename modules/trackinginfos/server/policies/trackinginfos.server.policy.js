'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Trackinginfos Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/trackinginfos',
      permissions: '*'
    }, {
      resources: '/api/trackinginfos/:trackinginfoId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/trackinginfos',
      permissions: ['get', 'post']
    }, {
      resources: '/api/trackinginfos/:trackinginfoId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/trackinginfos',
      permissions: ['get']
    }, {
      resources: '/api/trackinginfos/:trackinginfoId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Trackinginfos Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  return next();
};
