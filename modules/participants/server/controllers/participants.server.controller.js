'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Participant = mongoose.model('Participant'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Participant
 */
exports.create = function(req, res) {
  var participant = new Participant(req.body);

  participant.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(participant);
    }
  });
};

/**
 * Show the current Participant
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var participant = req.participant ? req.participant.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  participant.isCurrentUserOwner = true;

  res.jsonp(participant);
};

/**
 * Update a Participant
 */
exports.update = function(req, res) {
  var participant = req.participant ;

  participant = _.extend(participant , req.body);

  participant.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(participant);
    }
  });
};

/**
 * Delete an Participant
 */
exports.delete = function(req, res) {
  var participant = req.participant ;

  participant.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(participant);
    }
  });
};

/**
 * List of Participants
 */
exports.list = function(req, res) { 
  Participant.find().sort('-created').exec(function(err, participants) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(participants);
    }
  });
};

/**
 * Participant middleware
 */
exports.participantByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Participant is invalid'
    });
  }

  Participant.findById(id).exec(function (err, participant) {
    if (err) {
      return next(err);
    } else if (!participant) {
      return res.status(404).send({
        message: 'No Participant with that identifier has been found'
      });
    }
    req.participant = participant;
    next();
  });
};
