

const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String
    }
});

const Tags = mongoose.model('Tag', tagSchema);

module.exports = Tags;
