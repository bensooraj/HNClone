var express = require("express");
var router = express.Router();
var db = require("../models");
var bodyParser = require("body-parser");
var postRoutes = require('./postRoutes');

// Middlewares
router.use(bodyParser.urlencoded({ extended: true }));
router.use('/:username/posts', postRoutes);

// Routes
router.get('/:username', async function (req, res) {
    var user = await db.User
        .findOne({ username: req.params.username })
        .populate('posts')
        .populate('comments')
        .exec();

    if (!user) {
        res.render('users/noUser', {
            username: req.params.username
        });
    } else {
        res.render('users/user', { user });
    }
    // db.User.find({ username: req.params.username })
    //     .then(function (user) {
    //         console.log(user[0]);
    //         if (!user[0]) {
    //             console.log('The user you are looking for, doesn\'t exist!');
    //             res.send('The user you are looking for, doesn\'t exist!');
    //         } else {
    //             res.render('users/user', { user });
    //         }
    //     }, function (err) {
    //         res.send("ERROR: " + err + ", listing users @ " + req.url);
    //     });
});

module.exports = router;