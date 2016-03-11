'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Trackinginfo Schema
 */
var TrackinginfoSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Trackinginfo name',
    trim: true
  },
  raceParticipant: {
    type: Schema.ObjectId,
    ref: 'Participant'
  },
  dateTime: {
    type: Date,
    default: Date.now
  },
  pulse: {
    type: Number,
    default: 0
  },
  lat: {
    type: Number,
    default: 0
  },
  lng: {
    type: Number,
    default: 0
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Trackinginfo', TrackinginfoSchema);
