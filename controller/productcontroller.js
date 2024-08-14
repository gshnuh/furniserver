const express = require('express');
const multer = require('multer');
const Product = require('../model/productmodel');

const upload = multer({ dest: 'uploads/' });

exports.addproduct = async (req, res) => {
    const { name, category, tag, price, offerPrice } = req.body;
    try {
        const existingProduct = await Product.findOne({ name: name });
        if (existingProduct) {
            return res.status(400).json({ error: 'Existing Product' });
        }

        const imageFilePaths = req.files ? req.files.map(file => file.filename) : [];

        const product = new Product({
            name,
            image: imageFilePaths,
            category,
            tag,
            price,
            offerPrice,
        });

        const savedProduct = await product.save();
        res.status(200).json(savedProduct);
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: 'An error occurred while creating the Product' });
    }
};

exports.getAllProducts = async (req, res) => {

    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(deletedProduct);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the Product' });
    }
};

exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, category, tag, price, offerPrice } = req.body;

    const imageFilePaths = req.files ? req.files.map(file => file.filename) : [];

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const updateData = {
            name,
            category,
            tag,
            price,
            offerPrice
        };

        if (imageFilePaths.length > 0) {
            updateData.image = imageFilePaths;
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error });
    }
};
