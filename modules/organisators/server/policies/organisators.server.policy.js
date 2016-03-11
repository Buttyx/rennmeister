'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Organisators Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/organisators',
      permissions: '*'
    }, {
      resources: '/api/organisators/:organisatorId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/organisators',
      permissions: ['get', 'post']
    }, {
      resources: '/api/organisators/:organisatorId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/organisators',
      permissions: '*'
    }, {
      resources: '/api/organisators/:organisatorId',
      permissions: '*'
    }]
  }]);
};

/**
 * Check If Organisators Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  return next();
};
