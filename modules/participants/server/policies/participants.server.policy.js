'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Participants Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/participants',
      permissions: '*'
    }, {
      resources: '/api/participants/:participantId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/participants',
      permissions: ['get', 'post']
    }, {
      resources: '/api/participants/:participantId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/participants',
      permissions: '*'
    }, {
      resources: '/api/participants/:participantId',
      permissions: '*'
    }]
  }]);
};

/**
 * Check If Participants Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  return next();
};
