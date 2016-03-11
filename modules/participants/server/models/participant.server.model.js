'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Participant Schema
 */
var ParticipantSchema = new Schema({
  firstName: {
    type: String,
    default: '',
    required: 'Please fill Participant firstName',
    trim: true
  },  
  lastName: {
    type: String,
    default: '',
    required: 'Please fill Participant lastName',
    trim: true
  },
  address: {
    type: String,
    default: '',
    required: 'Please fill Participant address',
    trime: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Participant', ParticipantSchema);
