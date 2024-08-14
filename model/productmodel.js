var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const mongoose = require("mongoose");
const Productinfo = new mongoose.Schema({
  name: String,
  image: [String],
  category: String,
  tag: String,
  price: String,
  offerPrice: String,
});


const Product = mongoose.model('product', Productinfo);

module.exports = Product;