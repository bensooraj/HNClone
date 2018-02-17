const express = require('express');
const app = express();
require('dotenv').config()
var bodyParser = require("body-parser");
var db = require("./models");
const port = Number(process.env.PORT || 3000);

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
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

// For handling the comments
app.post('/posts/:post_id/comments/new', function (req, res) {
    console.log('Request to add new comment.');
    console.log(req.body);
    // user: commentuser
    res.send({"message": "Comment added successfully"});
});

app.get('/test', (req, res) => {
    var posts = await db.Post.find({})
        .populate('posts')
        .exec();

    res.render('posts/posts', {
        posts: posts
    });
});

app.listen(port, () => console.log('Example app listening on port 3000!'))