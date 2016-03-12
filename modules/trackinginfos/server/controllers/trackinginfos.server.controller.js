'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Trackinginfo = mongoose.model('Trackinginfo'),
  RaceParticipant = mongoose.model('RaceParticipant'),
  racesParticipants = require(path.resolve('./modules/races/server/controllers/race.participants.server.controller')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Trackinginfo
 */
exports.create = function(req, res) {
  var trackinginfo = new Trackinginfo(req.body);
  trackinginfo.user = req.user;

  racesParticipants.raceParticipantByRaceAndParticipation(trackinginfo.race, trackinginfo.participant, function (rp) {
    trackinginfo.save(function(err, ti) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        rp.trackingInfo = ti._id;
        rp.save(function () {
          res.jsonp(trackinginfo);
        });
      }
    });
  })

};

/**
 * Show the current Trackinginfo
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var trackinginfo = req.trackinginfo ? req.trackinginfo.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  trackinginfo.isCurrentUserOwner = req.user && trackinginfo.user && trackinginfo.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(trackinginfo);
};

/**
 * Update a Trackinginfo
 */
exports.update = function(req, res) {
  var trackinginfo = req.trackinginfo ;

  trackinginfo = _.extend(trackinginfo , req.body);

  trackinginfo.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(trackinginfo);
    }
  });
};

/**
 * Delete an Trackinginfo
 */
exports.delete = function(req, res) {
  var trackinginfo = req.trackinginfo ;

  trackinginfo.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(trackinginfo);
    }
  });
};

/**
 * List of Trackinginfos
 */
exports.list = function(req, res) { 
  Trackinginfo.find().sort('-created').exec(function(err, trackinginfos) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(trackinginfos);
    }
  });
};

/**
 * Trackinginfo middleware
 */
exports.trackinginfoByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Trackinginfo is invalid'
    });
  }

  Trackinginfo.findById(id).exec(function (err, trackinginfo) {
    if (err) {
      return next(err);
    } else if (!trackinginfo) {
      return res.status(404).send({
        message: 'No Trackinginfo with that identifier has been found'
      });
    }
    req.trackinginfo = trackinginfo;
    next();
  });
};
