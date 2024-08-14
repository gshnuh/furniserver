const express = require('express');
const multer = require('multer');
const Coupon = require('../model/couponmodel');

const upload = multer({ dest: 'uploads/' });

exports.addcoupon = async (req, res) => {
    const { name, code, discount } = req.body;
    try {
        const existingCoupon = await Coupon.findOne({ name: name });
        if (existingCoupon) {
            return res.status(400).json({ error: 'Existing Coupon' });
        }

        const imageFilePaths = req.files ? req.files.map(file => file.filename) : [];

        const coupon = new Coupon({
            name,
            image: imageFilePaths,
            code,
            discount,
        });

        const savedCoupon = await coupon.save();
        res.status(200).json(savedCoupon);
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: 'An error occurred while creating the Coupon' });
    }
};

exports.getAllCoupons = async (req, res) => {

    try {
        const coupons = await Coupon.find();
        res.status(200).json(coupons);
    } catch (error) {
        console.error("Error fetching coupons:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.deleteCoupon = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCoupon = await Coupon.findByIdAndDelete(id);
        if (!deletedCoupon) {
            return res.status(404).json({ error: 'Coupon not found' });
        }
        res.json(deletedCoupon);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the Coupon' });
    }
};

exports.updateCoupon = async (req, res) => {
    const { id } = req.params;
    const { name, code, discount } = req.body;

    const imageFilePaths = req.files ? req.files.map(file => file.filename) : [];

    try {
        const coupon = await Coupon.findById(id);

        if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found' });
        }

        const updateData = {
            name,
            code,
            discount,
        };

        if (imageFilePaths.length > 0) {
            updateData.image = imageFilePaths;
        }

        const updatedCoupon = await Coupon.findByIdAndUpdate(id, updateData, { new: true });

        res.json(updatedCoupon);
    } catch (error) {
        res.status(500).json({ error });
    }
};
