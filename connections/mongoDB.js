const mongoose = require('mongoose');

async function connectMongoDB(URL) {
    try {
        await mongoose.connect(URL);
        console.log('MongoDB Connected Successfully');
    } catch (error) {
        return res.status(500).json({message: 'MongoDB Connection Failed', error: error});
    }
}

module.exports = { connectMongoDB }