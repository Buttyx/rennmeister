'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Race participant Schema
 */
var RaceParticipantSchema = new Schema({
  firstName: {
    type: String,
    default: '',
    required: 'Please fill the participant first name',
    trim: true
  },  
  secondName: {
    type: String,
    default: '',
    required: 'Please fill the participant second name',
    trim: true
  },
  race: {
    type: Schema.ObjectId,
    ref: 'Race'
  },  
  participant: {
    type: Schema.ObjectId,
    ref: 'Participant'
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('RaceParticipant', RaceParticipantSchema);
