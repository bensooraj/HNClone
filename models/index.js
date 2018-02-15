var mongoose = require("mongoose");
mongoose.set('debug', true)
mongoose.connect('mongodb://localhost:27017/hackernews')

mongoose.Promise = Promise;

// Combine all the models
module.exports.User = require('./Users');
module.exports.Post = require('./Posts');
module.exports.Comment = require('./Comments');

/*
When require is given the path of a folder, it'll look for an index.js file in that 
folder; if there is one, it uses that, and if there isn't, it fails.
Source: https://stackoverflow.com/questions/5364928/node-js-require-all-files-in-a-folder
*/