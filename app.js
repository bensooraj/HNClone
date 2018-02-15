const express = require('express');
const app = express();
// var bodyParser = require("body-parser");

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
    res.redirect('/users');
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))