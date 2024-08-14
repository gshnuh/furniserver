const express = require('express');
const multer = require('multer');
const Order = require('../model/ordermodel');
var nodemailer = require('nodemailer');



const generateOrderId = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const randomDigits = String(Math.floor(Math.random() * 900) + 100);

    return `${year}${month}${day}${hours}${minutes}${seconds}-${randomDigits}`;
};




exports.addorderdetails = async (req, res) => {
    const { userId, billingAddress, shippingAddress, phone, email, paymentMethod, cardDetails, orderedProducts, totalAmount, status } = req.body;
    const orderid = generateOrderId();

    try {

        const order = new Order({
            orderid,
            billingAddress,
            shippingAddress,
            phone,
            email,
            paymentMethod,
            cardDetails,
            orderedProducts,
            totalAmount,
            userId,
            status: "Order Placed"
        });

        const savedOrder = await order.save();
        res.status(200).json(savedOrder);
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'gshnuh@gmail.com',
                pass: 'hvyv oymc vsmt zilb'
            }
        });

        var mailOptions = {
            from: 'gshnuh@gmail.com',
            to: email,
            subject: 'Order Details from Furni',
            text: 'Order Successfull! Your OrderId is {orderid}'
        };
        

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: 'An error occurred while placing the order' });
    }
};

exports.getAllOrders = async (req, res) => {

    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching coupons:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


exports.orderstatus = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findOne({ orderid: id });

        if (order) {
            res.status(200).json({ status: order.status });
        } else {
            res.status(404).json({ error: "Order not found" });
        }
    } catch (error) {
        console.error("Error fetching order status:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};



exports.getOrderbyuserId = async (req, res) => {
    const userId = req.params.id;

    try {
        const orders = await Order.find({ userId });
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching coupons:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


exports.cancelOrder = async (req, res) => {
    const { orderid } = req.params;

    try {
        console.log("Order ID for cancellation:", orderid);

        const order = await Order.findById(orderid);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        console.log("Current order status:", order.status);

        if (order.status !== 'Cancelled') {
            order.status = 'Cancellation Requested';
            await order.save();

            console.log("Updated order status:", order.status);

            return res.status(200).json(order);
        } else {
            return res.status(400).json({ error: 'Order is already cancelled' });
        }
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ error: 'An error occurred while cancelling the order' });
    }
};

exports.updatestatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;


    try {
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const updateData = {
            status
        };


        const updatedOrder = await Order.findByIdAndUpdate(id, updateData, { new: true });

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ error });
    }
};
