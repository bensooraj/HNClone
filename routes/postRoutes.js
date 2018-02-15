var express = require("express");
var router = express.Router({mergeParams: true});
var db = require("../models");
var bodyParser = require("body-parser");

// Middlewares
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', function (req, res) {
    res.render('users/posts/posts', {
        username: req.params.username,
        posts: 'Dummy Posts List'
    });
});

router.get('/new', function (req, res) {
    res.render('users/posts/newPost', {
        username: req.params.username,
    });
});




module.exports = router;