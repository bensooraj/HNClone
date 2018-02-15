var mongoose = require('mongoose');
var postSchema = new mongoose.Schema({
    title: String,
    username: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    points: Number,
    timestamp: Date,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

var Post = mongoose.model('Post', postSchema);

module.exports = Post;