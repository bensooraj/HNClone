var express = require("express");
var router = express.Router();
var db = require("../models");

router.get('/', function (req, res) {
    db.User.find({})
        .then(function (users) {
            res.render('users', {users});
        }, function (err) {
            res.send("ERROR listing users @ " + req.url);
        });
});

router.get('/', function (req, res) {
    db.User.find({})
        .then(function (users) {
            res.render('users', {users});
        }, function (err) {
            res.send("ERROR listing users @ " + req.url);
        });
});


module.exports = router;