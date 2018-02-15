var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "post title can't be blank"],
    },
    text: {
        type: String,
        required: [true, "post text can't be blank"],
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "a post must be associated with one user!"]
    },
    // points: Number,
    timestamp: Date,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, { timestamps: true });

var Post = mongoose.model('Post', postSchema);

module.exports = Post; 