const express = require('express');
const app = express();
require('dotenv').config()
// var bodyParser = require("body-parser");
var db = require("./models");

// Middlewares
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log("Requested URL: " + req.url);
    next();
});

// Get all the routes
var userRoutes = require('./routes/userRoutes');

// Assign the above routes to route paths
app.use('/users', userRoutes);

// Root path redirect
app.get('/', (req, res) => {
    res.redirect('/posts');
});

// All posts
app.get('/posts', async (req, res) => {
    var posts = await db.Post.find({})
        .populate('posts')
        .populate('comments')
        .exec();

    res.render('posts/posts', {
        posts: posts
    });
});

// 
app.get('/posts/:post_id', async (req, res) => {
    var post = await db.Post.findOne({ _id: req.params.post_id })
        .populate('posts')
        .populate('comments')
        .exec();
    var author = await db.User.findOne({ _id: post.author }).exec();
    console.log(author);
    console.log('Through population: ' + post.author);

    var comments = await db.Comment.find({ post: post._id }).exec();;
    console.log(comments);

    res.render('posts/post', {
        post: post,
        author: author,
        comments: comments
    });
});



app.listen(3000, () => console.log('Example app listening on port 3000!'))