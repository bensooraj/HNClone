var express = require("express");
var router = express.Router({ mergeParams: true });
var db = require("../models");
var bodyParser = require("body-parser");

// Middlewares
router.use(bodyParser.urlencoded({ extended: true }));

// Helper function
// Route handler, to restrict access to logged in users
function requireLogin(req, res, next) {
    if (!req.user) {
        res.redirect('/login');
    } else {
        next();
    }
};

// All posts
router.get('/posts', async (req, res) => {
    var posts = await db.Post.find({})
        .populate('author')
        .exec();

    res.render('posts/posts', {
        posts: posts
    });
});

// Single post
router.get('/posts/:post_id', async (req, res) => {
    var post = await db.Post.find({ _id: req.params.post_id })
        .populate('author')
        .populate({
            path: 'comments',
            // Populate author details inside the comment
            populate: { path: 'author' },
            // Sort the comments, to display comments in
            // chronological order
            options: {
                sort: { 'createdAt': 1 }
            }
        })
        .exec();

    res.render('posts/post', {
        post: post
    });
});

// Routes for creating a new post/submission
router.get('/submit', requireLogin, function (req, res) {
    res.render('posts/submit', {
        username: req.params.username,
    });
});

router.post('/submit', requireLogin, async function (req, res) {
    console.log('title: ' + req.body.title);
    console.log('text:  ' + req.body.text);

    // Get the "logged in" user from the User model
    var author = await db.User.findOne({ username: req.user.username }).exec();
    let authorID = author._id;

    // Create the new Post
    var newPost = new db.Post({
        title: req.body.title,
        text: req.body.text,
        author: authorID,
    });
    // Save the post to the DB
    newPost.save();

    console.log(newPost);
    // Save the newly created post to the user
    author = await db.User.findOneAndUpdate(
        { username: req.user.username },
        { $push: { posts: newPost } },
    );
    // console.log(author);

    res.redirect('/posts/' + newPost._id);
});

// Route for adding comments
router.post('/comment', requireLogin, async function (req, res) {
    // Get the user from the User model
    var author = await db.User.findOne({ username: req.user.username }).exec();

    // Create a new comment and save it to DB
    var newComment = new db.Comment({
        text: req.body.commentText,
        author: author._id,
        post: req.body.post_id
    });
    newComment.save();

    // Update User
    author = await db.User.findOneAndUpdate(
        { username: req.user.username },
        { $push: { comments: newComment } },
    );
    console.log(author);

    // Update Post
    var post = await db.Post.findOneAndUpdate(
        { _id: req.body.post_id },
        { $push: { comments: newComment } },
    );
    console.log(post);

    res.redirect('/posts/' + req.body.post_id);
});

module.exports = router;