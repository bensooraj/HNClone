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
            res.send("ERROR listing users @ " + req.url);
        });
});

router.post('/', function (req, res) {
    console.log('POST data:');
    console.log(req.body);
    // db.User.find({})
    //     .then(function (users) {
    //         res.render('users', {users});
    //     }, function (err) {
    //         res.send("ERROR: " + err + ", listing users @ " + req.url);
    //     });
    db.User.create(req.body)
        .then(function () {
            res.redirect('/')
        })
    res.redirect('/');
});


module.exports = router;