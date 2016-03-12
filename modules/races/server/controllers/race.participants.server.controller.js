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
  var raceParticipant = new RaceParticipant(req.body);
  raceParticipant.user = req.user;

  raceParticipant.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(raceParticipant);
    }
  });
};

/**
 * Show the current RaceParticipant
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var raceParticipant = req.raceParticipant ? req.raceParticipant.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  raceParticipant.isCurrentUserOwner = true;

  res.jsonp(raceParticipant);
};

/**
 * Update a RaceParticipant
 */
exports.update = function(req, res) {
  var raceParticipant = req.raceParticipant ;

  raceParticipant = _.extend(raceParticipant , req.body);

  raceParticipant.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(raceParticipant);
    }
  });
};

/**
 * Delete an RaceParticipant
 */
exports.delete = function(req, res) {
  var raceParticipant = req.raceParticipant ;

  raceParticipant.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(raceParticipant);
    }
  });
};

/**
 * List of RaceParticipants
 */
exports.list = function(req, res) { 
  var filter = {};

  if (req.query.participant) {
    filter.participant = req.query.participant;
  }  

  if (req.query.race) {
    filter.race = req.query.race;
  }

  RaceParticipant.find(filter).sort('-created').populate('trackingInfo').populate('user', 'displayName').exec(function(err, raceParticipants) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(raceParticipants);
    }
  });
};

/**
 * RaceParticipant middleware
 */
exports.raceParticipantByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'RaceParticipant is invalid'
    });
  }

  RaceParticipant.findById(id).populate('trackingInfo').populate('user', 'displayName').exec(function (err, raceParticipant) {
    if (err) {
      return next(err);
    } else if (!raceParticipant) {
      return res.status(404).send({
        message: 'No RaceParticipant with that identifier has been found'
      });
    }
    req.raceParticipant = raceParticipant;
    next();
  });
};

/**
 * RaceParticipant middleware
 */
exports.raceParticipantByRaceAndParticipation = function(raceId, participantId, callback) {

  RaceParticipant.findOne({race: raceId, participant: participantId}).sort('-created').exec(function (err, raceParticipant) {
    if (!err) {
      callback(raceParticipant);
    } 
  });
};
