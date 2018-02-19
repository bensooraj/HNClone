const express = require('express');
const app = express();
require('dotenv').config()
var bodyParser = require("body-parser");
var db = require("./models");
const port = Number(process.env.PORT || 3000);
// var session = require('express-session');
// var MongoStore = require('connect-mongo')(session);
// var bcrypt = require('bcrypt');

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use((req, res, next) => {
    console.log("Requested URL: " + req.url);
    next();
});

// For testing, sending a formatted response to the browser
app.set('json spaces', 2)

// USER * SIGN  UP * and * LOGIN * MAGIC
require('./routes/loginRoutes')(app)
// Route handler, to restrict access to logged in users
function requireLogin(req, res, next) {
    if (!req.user) {
        res.redirect('/login');
    } else {
        next();
    }
};

// Get all the routes
var userRoutes = require('./routes/userRoutes');
var postRoutes = require('./routes/postRoutes');

// Assign the above routes to route paths
app.use('/user', userRoutes);
app.use('/', postRoutes);

// Root path redirect
app.get('/', (req, res) => {
    res.redirect('/posts');
});

// For handling the comments
app.post('/posts/:post_id/comments/new', async function (req, res) {
    console.log('Request to add new comment.');
    console.log(req.body);
    // user: commentuser
    // Get the user from the User model
    var author = await db.User.findOne({ username: 'commentuser' }).exec();

    // Create a new comment and save it to DB
    var newComment = new db.Comment({
        text: req.body.comment,
        author: author._id,
        post: req.params.post_id
    });
    newComment.save();

    // Update User
    author = await db.User.findOneAndUpdate(
        { username: 'commentuser' },
        { $push: { comments: newComment } },
    );
    console.log(author);

    // Update Post
    var post = await db.Post.findOneAndUpdate(
        { _id: req.params.post_id },
        { $push: { comments: newComment } },
    );
    console.log(post);

    res.send({ "message": "Comment added successfully" });
});

// TEST LOGIN //

app.get('/test/view', requireLogin, async (req, res) => {
    // 
    console.log("req.sessionID: " + req.sessionID);
    console.log("req.user: " + JSON.stringify(req.user));
    console.log("req.user.username: " + req.user.username);
    res.render('testView');
});


app.listen(port, () => console.log('Example app listening on port 3000!'))


// useful piece of code:
// if (typeof data === 'object' && data !== null)