const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');
const Otp = require('../model/otpmodel');



const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gshnuh@gmail.com',
        pass: 'hvyv oymc vsmt zilb'
    }
});


exports.sendotp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send('Email is required');
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 30 * 1000);


    const otpEntry = new Otp({
        email: email,
        otp: generatedOtp,
        createdAt: new Date(),
        expiresAt: otpExpiresAt
    });

    try {
        await otpEntry.save();

        const mailOptions = {
            from: 'gshnuh@gmail.com',
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is: ${generatedOtp}`
        };


        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).send('Error sending OTP');
            } else {
                return res.status(200).send('OTP sent successfully');
            }
        });
    } catch (error) {
        console.error('Error saving OTP to database:', error);
        return res.status(500).send('Error saving OTP to database');
    }
}

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const otpEntry = await Otp.findOne({ email, otp });

        if (!otpEntry) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        if (new Date() > otpEntry.expiresAt) {
            return res.status(400).json({ error: 'OTP has expired' });
        }

        await Otp.deleteOne({ _id: otpEntry._id });

        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};