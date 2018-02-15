var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
    title: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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