var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema({
    orderid: String,
    billingAddress: String,
    phone: String,
    email: String,
    shippingAddress: String,
    paymentMethod: String,
    cardDetails: Object,
    orderedProducts: Array,
    totalAmount: String,
    status: String,
    otp: String,
    userId: String,
});


const Order = mongoose.model('order', OrderSchema);

module.exports = Order;