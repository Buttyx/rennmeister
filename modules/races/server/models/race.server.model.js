'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Race Schema
 */
var RaceSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Race name',
    trim: true
  },
  place: {
    type: String,
    default: '',
    required: 'Please add the location of the race',
    trim: true
  },
  dateFrom: {
    type: Date,
    default: Date.now
  },
  dateTo: {
    type: Date,
    default: Date.now
  },
  waypoints: {
    type: Array,
    default: []
  },
  organisator: {
    type: Schema.ObjectId,
    ref: 'Organisator'
  },
  participants: {
    type: Array,
    default: []
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

mongoose.model('Race', RaceSchema);
