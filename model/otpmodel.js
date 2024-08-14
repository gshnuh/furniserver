var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    expiresAt: { type: Date, required: true }
});

const Otp = mongoose.model('Otp', OtpSchema);

module.exports = Otp;