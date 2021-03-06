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
var voteRoutes = require('./routes/voteRoutes');

// Assign the above routes to route paths
app.use('/user', userRoutes);
app.use('/', postRoutes);
app.use('/', voteRoutes);

// Root path redirect
app.get('/', (req, res) => {
    res.redirect('/posts');
});


// TEST ROUTES //
// app.post('/test/vote', requireLogin, async (req, res) => {
//     
// });


app.listen(port, () => console.log('Example app listening on port 3000!'))


// useful piece of code:
// if (typeof data === 'object' && data !== null)