var express = require("express");
var router = express.Router({ mergeParams: true });
var db = require("../models");
var bodyParser = require("body-parser");

// Middlewares
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', async function (req, res) {
    var author = await db.User.findOne({ username: req.params.username })
                              .populate('posts').exec();
    console.log(author);

    res.render('users/posts/posts', {
        username: req.params.username,
        posts: author.posts
    });
});

router.post('/', async function (req, res) {
    console.log('title: ' + req.body.title);
    console.log('text:  ' + req.body.text);

    // Get the user from the User model
    var author = await db.User.findOne({ username: req.params.username }).exec();
    let authorID = author._id;
    console.log(author);
    console.log(authorID);

    // Create the new Post
    var newPost = new db.Post({
        title: req.body.title,
        text: req.body.text,
        author: authorID,
        timestamp: new Date(),
    });
    // Save the post to the DB
    newPost.save();

    console.log(newPost);
    // Save the newly created post to the user
    author = await db.User.findOneAndUpdate(
        { username: req.params.username },
        { $push: { posts: newPost } },
    );
    console.log(author);

    res.redirect('/users/' + req.params.username + '/posts');
});

router.get('/new', function (req, res) {
    res.render('users/posts/newPost', {
        username: req.params.username,
    });
});




module.exports = router;