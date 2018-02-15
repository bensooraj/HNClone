var express = require("express");
var router = express.Router();
var db = require("../models");
var bodyParser = require("body-parser");

// Middlewares
router.use(bodyParser.urlencoded({ extended: true }));

// Routes
router.get('/', function (req, res) {
    db.User.find({})
        .then(function (users) {
            res.render('users/users', { users });
        }, function (err) {
            res.send("ERROR: " + err + ", listing users @ " + req.url);
        });
});

router.post('/', function (req, res) {
    console.log('POST data:');
    console.log(req.body);

    db.User.create(req.body)
        .then(function () {
            res.redirect('/')
        }, function (err) {
            res.send("ERROR: " + err + ", listing users @ " + req.url);
        })
});

router.get('/:username', function (req, res) {
    db.User.find({username: req.params.username})
        .then(function (user) {
            console.log(user);
            res.render('users/user', { user });
        }, function (err) {
            res.send("ERROR: " + err + ", listing users @ " + req.url);
        });
});

module.exports = router;