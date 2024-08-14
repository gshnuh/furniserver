const mongoose = require('mongoose');

const dbUri = 'mongodb://0.0.0.0:27017/furni';

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/furni', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB Connected Successfully")
    } catch (err) {
        console.error('MongoDB connection error:', err);
    };

}


module.exports = connectDB