var express = require("express");
var router = express.Router();
var db = require("../models");
var bodyParser = require("body-parser");
var postRoutes = require('./postRoutes');

// Middlewares
router.use(bodyParser.urlencoded({ extended: true }));
// router.use('/:username/posts', postRoutes);

// Routes
// Overview | User's page
router.get('/:username', async function (req, res) {
    var userProfile = await db.User
        .findOne({ username: req.params.username })
        .populate('posts')
        .populate('comments')
        .exec();

    if (!userProfile) {
        res.render('users/noUser', {
            username: req.params.username
        });
    } else {
        res.render('users/user', { userProfile });
    }
});

// Posts | User's page
router.get('/:username/posts', async function (req, res) {
    var userProfile = await db.User
        .findOne({ username: req.params.username })
        .populate('posts')
        // .populate('comments')
        .exec();

    if (!userProfile) {
        res.render('users/noUser', {
            username: req.params.username
        });
    } else {
        res.render('users/posts', { userProfile });
    }
});

module.exports = router;