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
 * Pickup Request Schema
 */
var RequestSchema = new Schema({
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
  bag: {
    type: Number,
    default: 1,
    required: 'Number of bags cannot be blank'
  },
  carryon: {
    type: Number,
    default: 0,
    required: 'Number of carry-ons cannot be blank'
  },
  baggage: {
    type: Number,
    default: 2,
    required: 'Number of baggages cannot be blank'
  },
  user: {
    type: String
  },
  accepted: {
    type: Boolean,
    default: false
  }
});

mongoose.model('Request', RequestSchema);
