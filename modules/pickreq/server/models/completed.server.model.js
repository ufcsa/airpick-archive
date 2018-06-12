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
    trim: true,
    required: 'Airport cannot be blank'
  },
  arrivalTime: {
    type: Date,
    required: 'Arrival Time cannot be blank'
  },
  user: {
    type: String,
    required: 'username of requester cannot be blank'
  },
  volunteer: {
    type: String,
    required: 'volunteer cannot be blank'
  }
});

CompletedSchema.pre('save', function (next) {
  this.created = new Date;
  next();
});

mongoose.model('Completed', CompletedSchema);
