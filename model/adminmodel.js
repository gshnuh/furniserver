var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const mongoose = require("mongoose");
const formData = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  address: String,
  address1: String,
  image: String,
  zip: String,
  country: String,
  state: String,
  token: String,
});

formData.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    if (!this.password.startsWith('$2b$')) {
      try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;

        if (this.isNew) {
          const token = jwt.sign({ email: this.email }, 'myjwtsecretkey'); // Generate token using email
          this.token = token;
        }
        next();
      } catch (error) {
        return next(error);
      }
    } else {
      return next();
    }
  } else {
    return next();
  }
});

const Data = mongoose.model('data', formData);

module.exports = Data;