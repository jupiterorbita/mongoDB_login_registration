var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var path = require("path");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./static")));
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");

// #### server start
const server = app.listen(5000);

//mongoose DB
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/login_registration");
mongoose.Promise = global.Promise;

// flash messages
const flash = require("express-flash");
app.use(flash());
//bcrypt
const bcrypt = require("bcrypt-as-promised");
//session
const session = require("express-session");
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "ausgdsgda9sudhasduoasdbuo",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
  })
);

// ==============  DB schema  ================
var UserSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true, minlength: [3, 'test1 '], maxlength: [20, 'test11'] },
    last_name: { type: String, required: true, minlength: [3, 'test2'], maxlength: [20, 'test22'] },
    email: { type: String, required: true, minlength: 3, maxlength: 20 },
    birthday: { type: Date, required: true },
    password: { type: String, required: true, minlength: 3, maxlength: 22 }
  },
  { timestamps: true }
);
mongoose.model("User", UserSchema); //we are setting this schema in our Models as 'User'
var User = mongoose.model("User"); //retreiving this Schema from Models named 'User' and storing in a mega var User obj
// console.log("User ==================>", User)

// app.get('/home')
// app.get('/home/test')
// app.get('/home/hello')
// app.get('/home/:id') req.params.id 
// app.get('/home/abcdfeg') <-- wil not run!!!!

// /home/abcdfeg

// ============= INDEX ROUTE ==================
app.get("/", function(req, res) {
  console.log('\n ======> "/" <=====');
  
  res.render("index", {
    first_name_reg_error: req.flash('first_name_reg_error') || '',
    last_name_reg_error: req.flash('last_name_reg_error') || '',
  });
});

app.get("/success", function(req, res) {
  console.log('\n ======> "/success" <=====');
  res.render("success");
});

// ================ LOGIN METHOD ==================
app.post("/login", function(req, res) {
  console.log("\n =======> LOGIN METHOD <========");
  console.log("\n>> POST DATA ===>", req.body);
  console.log("req.body.email==>", req.body.email);


//   User
//   .findOne({ email: req.body.email })
//   .then((user) => { })
//   .catch((err) => { })


  User.findOne({ email: req.body.email }, function(err, user) {
    
    if (err) { // INTENRAL ERROR
        console.log("server sucks");
        // redirec to login page, erro send back is more sometwent wong please contact admin.
    } else if (user) { // USER EXISTS
        // user exists, lets get the pass, hash it and compare...
        // session id, redirect to user page/success
        // 1) get pass from body. hash it and compare it hash.compare(body.password, db_password)
        // 2) if true, login them => session id, redirect to /success
        // 2.2) if false, redirect to login, give em a message "invalid credentails"
    } else { // USER DOES NOT EXIST
        // respond back to user, with invalid credentials... 
        // invalid user so redirect to root/login page
    }
    
    
    // http.get('/pokemon/1', function(response){
    //     http.get('/pokemon/2', function(response){
    //         http.get('/pokemon/3', function(response){
    //             http.get('/pokemon/4', function(response){
                    
    //             })
    //         })
    //     })  
    // })

    // http.get('/pokemon/1')
    // .then(function(response){

    //     return http.get('/pokemon/2')  
    // }).then(function(response){

    //     return http.get('/pokemon/3')
    // }).then(function(response){

    //     return http.get('/pokemon/4')
    // }).then(function(response){
            
    // })



    // http.get('/pokemon/1', function(response){
        
    // })
    // http.get('/pokemon/2', function(response){
        
    // })
    // http.get('/pokemon/3', function(response){
        
    // })
    // http.get('/pokemon/4', function(response){
        
    // })
    
    
    
    if (err) {
      console.log("Error importing user");
    } else {
      user = user;
      console.log("user => ", user);
    }

    if (!user) {
      console.log("no user in db - invalid email!");
      req.flash("login", "INVALID EMAIL");
      res.redirect("/");
    } else if (user.password != req.body.password) {
      req.flash("login", "Wrong password!");
      res.redirect("/");
    } else {
      console.log("success, email came back and pw matches");
      req.session.id = user._id;
      res.redirect("/success");
    }
  });
});
  // ================= REGISTER METHOD ===============
  app.post("/register", function(req, res) {
    console.log('\n ======> "/register" METHOD <=====');
    console.log("POST DATA", req.body);

    var userInstance = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
      birthday: req.body.birthday
    });

    console.log("@@@@@@@@@@@@@@@@@@ \nuserInstance", userInstance);

    userInstance.save(function(err) {
      // RUN VALIDATOR AND SAVE (IF VALIDATOR PASSES)

      // ERRORS
      if (err) {
        console.log("@@@@@@@@@@@@@@@@ we have an error ERR", err);
        console.log("@@@@@@@@@@@@@@@@ we have an error ERR.ERRORS", err.errors);
        console.log("@@@@@@@@@@@@@@@@ we have an error ERR.ERRORS", err.errors.first_name);
        console.log("@@@@@@@@@@@@@@@@ we have an error ERR.ERRORS", err.errors.last_name);
        console.log("@@@@@@@@@@@@@@@@ we have an error ERR.ERRORS", err.errors.email);

        if(err.errors.first_name){
            req.flash('first_name_reg_error', err.errors['first_name'].message)
        }
        // if(err.errors.first_name){
        //     req.flash('last_name_error', 'Message cool for fist name')
        // }
        // if(err.errors.first_name){
        //     req.flash('email_error', 'Message cool for fist name')
        // }
        // if(err.errors.first_name){
        //     req.flash('first_name_error', 'Message cool for fist name')
        // }
        // if(err.errors.first_name){
        //     req.flash('first_name_error', 'Message cool for fist name')
        // }

        // for (var key in err.errors) {
        //   req.flash("registration", err.errors[key].message);
        // }
        res.redirect("/");
      } else {
        // NO ERRORS
        console.log("successfully added a user!");
        res.redirect("/success");
      }
    });
  });
