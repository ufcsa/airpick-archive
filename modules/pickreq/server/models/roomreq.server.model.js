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
 * Rooming Request Schema
 */
var RoomreqSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  startDate: {
    type: Date,
    required: 'Start date cannot be blank'
  },
  leaveDate: {
    type: Date,
    required: 'Leave date cannot be blank'
  },
  user: {
    type: String,
    required: 'username of requester cannot be blank'
  },
  volunteer: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  published: {
    type: Boolean,
    default: true
  }
});

RoomreqSchema.pre('save', function (next) {
  this.created = new Date;
  next();
});

mongoose.model('Roomreq', RoomreqSchema);
