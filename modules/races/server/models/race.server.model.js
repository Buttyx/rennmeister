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
    type: String,
    default: '',
    required: 'Please fill dateFrom'
  },
  dateTo: {
    type: String,
    default: '',
    required: 'Please fill dateTo'
  },
  waypoints: {
    type: Array,
    default: []
  },
  organisator: {
    type: Schema.ObjectId,
    ref: 'Organisator'
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Race', RaceSchema);
