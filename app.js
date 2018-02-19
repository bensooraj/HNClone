const express = require('express');
const app = express();
require('dotenv').config()
var bodyParser = require("body-parser");
var db = require("./models");
const port = Number(process.env.PORT || 3000);
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var bcrypt = require('bcrypt');

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

// U S E R * L O G I N * R E L A T E D
var mongoose = require('mongoose');
// Uncomment the following when running via mLAB
// var connectURL = "mongodb://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@ds237748.mlab.com:37748/ben-hackernews-clone";
// Uncomment the following when running via localhost
var connectURL = "mongodb://localhost:27017/hackernews";
mongoose.connect(connectURL);
var dbSessions = mongoose.connection;
dbSessions.once('open', function () {
    // Testing the DB connection
    console.log('Connected to DB, for storring sessions!');
});
//use sessions for tracking logins
app.use(session({
    secret: '7}~49GCd/)iHMDWJHMIp9k+3J^J8t4B3Uu1g$EqIxo[A6:c|n*D{!Z=*!XnX',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: dbSessions
    }),
    unset: 'destroy'
}));
app.use(async function (req, res, next) {
    // Check if session exists
    if (req.session && req.session.user) {
        // Lookup the user in the DB by pulling their username from the session
        var user = await db.User.findOne({ username: req.session.user.username });
        console.log("user object: ");
        console.log(user);
        // set the password to null
        user.password = null;
        if (user) {
            req.user = user;
            req.session.user = user;
            res.locals.user = user;

            // Remove ======================
            console.log('res.locals: ');
            console.log(res.locals);

            console.log('req.user: ');
            console.log(req.user);
            console.log('req.user.password: ' + req.user.password);

            console.log('req.sessions: ');  //\
            console.log(req.session);      //||
            // Remove =========================
        }
        next();
    } else {
        next();
    }
});

// Get all the routes
var userRoutes = require('./routes/userRoutes');

// Assign the above routes to route paths
app.use('/users', userRoutes);

// Root path redirect
app.get('/', (req, res) => {
    res.redirect('/posts');
});

function requireLogin(req, res, next) {
    if (!req.user) {
        res.redirect('/login');
    } else {
        next();
    }
};

// All posts
app.get('/posts', async (req, res) => {
    var posts = await db.Post.find({})
        .populate('author')
        .exec();

    res.render('posts/posts', {
        posts: posts
    });
});

// 
app.get('/posts/:post_id', async (req, res) => {
    var post = await db.Post.find({ _id: req.params.post_id })
        .populate('author')
        .populate({
            path: 'comments',
            // Populate author details inside the comment
            populate: { path: 'author' },
            // Sort the comments, to display comments in
            // chronological order
            options: {
                sort: { 'createdAt': 1 }
            }
        })
        .exec();

    res.render('posts/post', {
        post: post
    });
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

// Sign Up
app.get('/signup', async (req, res) => {
    var error;
    res.render('users/signUp', { error });
});
app.post('/signup', async (req, res) => {
    var error;
    // confirm that user typed same password twice
    if (req.body.password !== req.body.passwordConfirmation) {
        error = "The passwords don't match. Please try again.";
        res.render('users/signUp', { error });
    }

    if (req.body.username && req.body.password) {
        var userObject = {
            username: req.body.username,
            password: req.body.password
        };
        db.User.create(userObject)
            .then(function () {
                res.redirect('/');
            }, function (err) {
                error = err;
                res.render('users/signUp', { error });
            });
    } else {
        error = 'Please enter a username and password';
        res.render('users/signUp', { error });
    }
});

app.get('/login', async function (req, res) {
    var user = await db.User.findOne({ username: req.body.username });
    if (req.user) {
        // console.log(req.user);
        res.redirect('/');
    } else {
        var error;
        res.render('users/login', { error });
    }
});

app.post('/login', async function (req, res) {
    var error;
    console.log('Username: ' + req.body.username + ' | Password: ' + req.body.password);
    var user = await db.User.findOne({ username: req.body.username });
    if (!user) {
        // If the user doesn't exist, display the login page again
        error = "The username doesn't exist! Try again.";
        res.render('users/login', { error });
    } else {
        if (bcrypt.compareSync(req.body.password, user.password)) {
            // set the password to null
            user.password = null;
            // Store the user in the session:
            req.session.user = user;
            res.redirect('/');
        } else {
            // If the password doesn't match, display the login page again
            error = "The password that you've entered is incorrect! Try again.";
            res.render('users/login', { error });
        }
    }
});

app.post('/logout', async function (req, res) {
    // https://github.com/jdesboeufs/connect-mongo/issues/140#issuecomment-68108810
    // Delete the session
    // One of the following two lines of code should be working, 
    // but they are not, and not terminating the user session
    // req.session = null;
    // req.session.destroy();

    // So, I eplicitly delete the cookie from the user's browser
    res.clearCookie('connect.sid');
    // And remove the session stored in the 'sessions' collection
    // so I don't pile up useless sessions
    var sessionCollection = await mongoose.connection.db.collection("sessions");
    await sessionCollection.findOneAndDelete({ _id: req.sessionID });
    // Redirect the user to the homepage
    res.redirect('/');
});

// TEST LOGIN //

app.get('/test/view', requireLogin, async (req, res) => {
    // 
    console.log("req.sessionID: " + req.sessionID);
    var sessionCollection = await mongoose.connection.db.collection("sessions");
    var sess_ID = await sessionCollection.findOne({ _id: req.sessionID });

    console.log("sess_ID: " + JSON.stringify(sess_ID));
    res.render('testView');
});


app.listen(port, () => console.log('Example app listening on port 3000!'))


// useful piece of code:
// if (typeof data === 'object' && data !== null)