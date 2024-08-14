const express = require('express');
const multer = require('multer');   
const Tags = require('../model/tagmodel');

const upload = multer({ dest: 'uploads/' });
  
exports.addtags = async (req, res) => {
  const { name } = req.body;
  try {
      const existingTags = await Tags.findOne({ name: name });
      if (existingTags) {
          return res.status(400).json({ error: 'Existing Tag' });
      }

      const imageFilePath = req.file ? req.file.filename : undefined;
      
      const tag = new Tags({
          name,
          image: imageFilePath,
      });

      const savedtag = await tag.save();
      res.status(200).json(savedtag);
  } catch (error) {
      console.error('Error occurred:', error);
      res.status(500).json({ error: 'An error occurred while creating the Tag' });
  }
};



exports.getAllTags = async (req, res) => {
  try {
      const tag = await Tags.find();
      res.status(200).json(tag);
  } catch (error) {
      console.error("Error fetching tags:", error);
      res.status(500).json({ error: "Internal server error" });
  }
};


exports.deletetag = async (req, res) => {
    const { id } = req.params;
    
    try {
      const deletedtag = await Tags.findByIdAndDelete(id);
      if (!deletedtag) {
        return res.status(404).json({ error: 'Tag not found' });
      }
      res.json(deletedtag);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while deleting the Tag' });
    }
  };

   
exports.updatetag = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const imageFilePath = req.file ? req.file.filename : undefined;
  try {
    const savedtag = await Tags.findByIdAndUpdate(
      id, {
        name,
      image:imageFilePath,
    }, { new: true });
    if (!savedtag) {
      return res.status(404).json({ error: 'Tag not found' });
    }
    res.json(savedtag);

  } catch (error) {
    res.status(500).json({ error });
  }
};