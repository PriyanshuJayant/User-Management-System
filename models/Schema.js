const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    age: {
        type: Number,
        required: true,
        min: 1,
        max: 120,
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'other'],
    }
}, {timestamps: true});

const User = mongoose.model('users', userSchema);

module.exports = User;