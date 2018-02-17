var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        lowercase: true,
        required: [true, "can't be blank"],
        match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
        index: true
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, { timestamps: true });

var User = mongoose.model('User', userSchema);

// Async Unique Validation for `username`
// Resource: http://timstermatic.github.io/blog/2013/08/06/async-unique-validation-with-expressjs-and-mongoose/
User.schema.path('username').validate(async function (value) {
    var user = await User.findOne({ username: value });
    if (user) {
        console.log('Users exists!');
        return false;
    }
}, 'This username is already taken!');

module.exports = User;
