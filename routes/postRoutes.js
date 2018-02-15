var express = require("express");
var router = express.Router({mergeParams: true});
var db = require("../models");
var bodyParser = require("body-parser");

// Middlewares
router.use(bodyParser.urlencoded({ extended: true }));

router.get('', function (req, res) {
    // 
});