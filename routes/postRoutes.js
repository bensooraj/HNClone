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
    console.log(author);
    console.log(authorID);

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
    console.log(author);

    res.redirect('/posts/' + newPost._id);
});




module.exports = router;