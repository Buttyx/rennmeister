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
    required: 'Please fill organisator name',
    trim: true
  },
  birthdate: {
    type: String,
    default: '',
    required: 'Please fill organisator birthdate'
  },
  location: {
    type: String,
    default: '',
    required: 'Please fill organisator location',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Organisator', OrganisatorSchema);
