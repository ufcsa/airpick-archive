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
    default: 'Orlando International Airport',
    trim: true,
    required: 'Airport cannot be blank'
  },
  arrivalTime: {
    type: Date,
    default: '',
    trim: true,
    required: 'Arrival Time cannot be blank'
  },
  numberBag: {
    type: Number,
    default: 1,
    required: 'Number of bags cannot be blank'
  },
  numberCarryon: {
    type: Number,
    default: 0,
    required: 'Number of carry-ons cannot be blank'
  },
  numberBaggage: {
    type: Number,
    default: 2,
    required: 'Number of baggages cannot be blank'
  },
  user: {
    type: String,
    required: 'username of requester cannot be blank'
  },
  accepted: {
    type: Boolean,
    default: false
  }
});

RequestSchema.pre('save', function (next) {

  next();
});

mongoose.model('Request', RequestSchema);
