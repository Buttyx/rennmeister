'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Organisator Schema
 */
var OrganisatorSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Organisator name',
    trim: true
  },
  birthdate: {
    type: Date,
    default: Date.now,
    required: 'Please fill Organisator birthdate'
  },
  location: {
    type: String,
    default: 'Switzerland',
    trim: true

  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Organisator', OrganisatorSchema);
