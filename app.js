const express = require('express');
const app = express();
var bodyParser = require("body-parser");

// Middlewares
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log("Requested URL: " + req.url);
    next();
});

app.get('/', function (req, res) {
    res.send('Hello');
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))