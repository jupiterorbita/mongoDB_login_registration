var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var path = require("path");
app.use(bodyParser.urlencoded({extended: true}));
//app.use(express.static(__dirname + "/static"));
app.use(express.static(path.join(__dirname, "./static")));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

// #### server start
const server = app.listen(5000);

//mongoose DB
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/DB_NAME!!@!!@@@@@@@');
mongoose.Promise = global.Promise;

// flash messages
const flash = require('express-flash');
app.use(flash());

//session
const session = require('express-session');
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))

app.get('/', function(req, res){
    console.log(' ======> "/" <=====');
    res.render('index');
})

app.get('/success', function(req, res){
    console.log(' ======> "/success" <=====');
    res.render('success')
})