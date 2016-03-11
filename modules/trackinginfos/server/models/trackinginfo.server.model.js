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
  participant: {
    type: Schema.ObjectId,
    ref: 'Participant',
    required: 'Please fill participantId'
  },
  race: {
    type: Schema.ObjectId,
    ref: 'Race',
    required: 'Please fill raceId'
  },
  dateTime: {
    type: Date,
    default: Date.now
  },
  pulse: {
    type: Number,
    default: ''
  },
  lat: {
    type: Number,
    default: '',
    required: 'Please fill latitude'
  },
  lng: {
    type: Number,
    default: '',
    required: 'Please fill longitude'
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Trackinginfo', TrackinginfoSchema);
