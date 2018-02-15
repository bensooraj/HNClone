var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    text: String,
    username: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    timestamp: Date
});

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;