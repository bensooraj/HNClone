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

// Route for Vote
router.post('/vote', requireLogin, async (req, res) => {
    // 
    console.log("req.body.post_id: " + req.body.post_id);
    // Update the Post model
    var post = await db.Post.findOneAndUpdate(
        {_id: req.body.post_id},
        {
            $addToSet: { votes: req.user._id },
        }
    );
    // Update the User model
    var votedUser = await db.User.findOneAndUpdate(
        {username: req.user.username},
        {
            $addToSet: { votedPosts: req.body.post_id },
        }
    );
    // console.log("req.user._id: " + req.user._id);
    // console.log(post);
    res.redirect('/posts/' + req.body.post_id);
});

// Route for Unvote
router.post('/unvote', requireLogin, async (req, res) => {
    // 
    console.log("req.body.post_id: " + req.body.post_id);
    // Update the Post model
    var post = await db.Post.findOneAndUpdate(
        {_id: req.body.post_id},
        {
            $pull: { votes: req.user._id },
        }
    );
    // Update the User model
    var votedUser = await db.User.findOneAndUpdate(
        {username: req.user.username},
        {
            $pull: { votedPosts: req.body.post_id },
        }
    );
    // console.log("req.user._id: " + req.user._id);
    // console.log(post);
    res.redirect('/posts/' + req.body.post_id);
});

module.exports = router;