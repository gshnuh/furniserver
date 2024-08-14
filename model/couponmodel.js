var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const mongoose = require("mongoose");
const Couponinfo = new mongoose.Schema({
  name: String,
  image: [String],
  code: String,
  discount: String,
});


const Coupon = mongoose.model('coupon', Couponinfo);

module.exports = Coupon;