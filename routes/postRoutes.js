var express = require("express");
var router = express.Router({mergeParams: true});
var db = require("../models");
var bodyParser = require("body-parser");

// Middlewares
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', function (req, res) {
    res.send('Posts of user: ' + req.params.username);
});


module.exports = router;