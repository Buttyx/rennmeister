'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Organisator = mongoose.model('Organisator'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Organisator
 */
exports.create = function(req, res) {
  var organisator = new Organisator(req.body);

  organisator.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(organisator);
    }
  });
};

/**
 * Show the current Organisator
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var organisator = req.organisator ? req.organisator.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  organisator.isCurrentUserOwner = true;

  res.jsonp(organisator);
};

/**
 * Update a Organisator
 */
exports.update = function(req, res) {
  var organisator = req.organisator ;

  organisator = _.extend(organisator , req.body);

  organisator.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(organisator);
    }
  });
};

/**
 * Delete an Organisator
 */
exports.delete = function(req, res) {
  var organisator = req.organisator ;

  organisator.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(organisator);
    }
  });
};

/**
 * List of Organisators
 */
exports.list = function(req, res) { 
  Organisator.find().sort('-created').exec(function(err, organisators) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(organisators);
    }
  });
};

/**
 * Organisator middleware
 */
exports.organisatorByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Organisator is invalid'
    });
  }

  Organisator.findById(id).exec(function (err, organisator) {
    if (err) {
      return next(err);
    } else if (!organisator) {
      return res.status(404).send({
        message: 'No Organisator with that identifier has been found'
      });
    }
    req.organisator = organisator;
    next();
  });
};
