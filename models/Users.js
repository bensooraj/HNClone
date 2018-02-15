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

// Async Unique Validation for `username`
// Resource: http://timstermatic.github.io/blog/2013/08/06/async-unique-validation-with-expressjs-and-mongoose/
User.schema.path('username').validate(function (value, validateAs) {
    User.findOne({username: value}, function (err, user) {
        if(user) validateAs(false);
    })
}, 'This username is already taken!');