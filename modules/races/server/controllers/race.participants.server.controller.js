'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  RaceParticipant = mongoose.model('RaceParticipant'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a RaceParticipant
 */
exports.create = function(req, res) {
  var race = new RaceParticipant(req.body);
  race.user = req.user;

  race.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(race);
    }
  });
};

/**
 * Show the current RaceParticipant
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var race = req.race ? req.race.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  race.isCurrentUserOwner = req.user && race.user && race.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(race);
};

/**
 * Update a RaceParticipant
 */
exports.update = function(req, res) {
  var race = req.race ;

  race = _.extend(race , req.body);

  race.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(race);
    }
  });
};

/**
 * Delete an RaceParticipant
 */
exports.delete = function(req, res) {
  var race = req.race ;

  race.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(race);
    }
  });
};

/**
 * List of RaceParticipants
 */
exports.list = function(req, res) { 
  var filter = {};

  if (typeof organisator !== 'undefined') {
    filter.organisator = organisator;
  }

  RaceParticipant.find().sort('-created').populate('user', 'displayName').exec(function(err, races) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(races);
    }
  });
};

/**
 * RaceParticipant middleware
 */
exports.raceByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'RaceParticipant is invalid'
    });
  }

  RaceParticipant.findById(id).populate('user', 'displayName').exec(function (err, race) {
    if (err) {
      return next(err);
    } else if (!race) {
      return res.status(404).send({
        message: 'No RaceParticipant with that identifier has been found'
      });
    }
    req.race = race;
    next();
  });
};
