'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  path = require('path'),
  config = require(path.resolve('./config/config')),
  chalk = require('chalk');

/**
 * Completed Request Schema
 */
var CompletedSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  airport: {
    type: String,
    trim: true
  },
  arrivalTime: {
    type: Date
  },
  user: {
    type: String,
    required: 'username of requester cannot be blank'
  },
  volunteer: {
    type: String,
    required: 'volunteer cannot be blank'
  },
  leaveDate: {
    type: Date
  },
  isRoomReq: {
    type: Boolean,
    default: false
  }
});

CompletedSchema.pre('save', function (next) {
  this.created = new Date;
  next();
});

mongoose.model('Completed', CompletedSchema);
