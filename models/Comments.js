var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    text: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    timestamp: Date
}, { timestamps: true });

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;