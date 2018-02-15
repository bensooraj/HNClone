var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        lowercase: true,
        required: [true, "can't be blank"],
        match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
        index: true
    }
}, { timestamps: true });

var User = mongoose.model('User', userSchema);

module.exports = User;