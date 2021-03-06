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
    secret: "asdf",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
  })
);

// ==============  DB USER schema  ================
var UserSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "first name is required!"],
      minlength: [3, "first name must be at least 3 letters "],
      maxlength: [20, "first name must be less than 20 letters"]
    },
    last_name: {
      type: String,
      required: [true, "Last name is required!!"],
      minlength: [3, "Last name at least 3 chars"],
      maxlength: [20, "Last name NO more than 20 chars!"]
    },
    email: {
      type: String,
      //   unique: [true, "email aready exists"],
      required: [true, "email cannot be empty"],
      minlength: [3, "email at least 3 long"],
      maxlength: [20, "why such a big email?"]
    },
    birthday: { type: Date, required: [true, "please enter a birthday"] },
    password: {
      type: String,
      required: [true, "pass cannot be empty!!"],
      minlength: [3, "pass must be at least 3 chars!!!"],
      maxlength: [22, "ok... not that long"]
    }
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

// ============= INDEX ROUTE ========================
app.get("/", function(req, res) {
  console.log('\n ======> "/" <=====');

  res.render("index", {
    first_name_reg_error: req.flash("first_name_reg_error") || "",
    last_name_reg_error: req.flash("last_name_reg_error") || ""
  });
});

// ============== SUCCESS PAGE =====================
app.get("/success", function(req, res) {
  if (req.session.first_name) {
    console.log('\n ======> "/success" <=====');
    user = req.session.first_name;
    res.render("success", { user: user });
  } else {
      console.log('user tried to login without access!');
      req.flash('registration', 'PLEASE REGISTER FIRST OR LOGIN')
    res.redirect("/");
  }
});

// =============== LOGOUT =========================
app.get("/logout", function(req, res) {
  req.session.destroy();
  console.log("\n session=>", req.session);
  res.redirect("/");
});

// ================ LOGIN METHOD ==================
app.post("/login", function(req, res) {
  console.log("\n =======> LOGIN METHOD <========");

  User.findOne({ email: req.body.email }, function(err, user) {
    // if (err) { // INTENRAL ERROR
    //     // console.log("server sucks");
    //     // redirec to login page, erro send back is more sometwent wong please contact admin.
    // } else if (user) { // USER EXISTS
    //     // user exists, lets get the pass, hash it and compare...
    //     // session id, redirect to user page/success
    //     // 1) get pass from body. hash it and compare it hash.compare(body.password, db_password)
    //     // 2) if true, login them => session id, redirect to /success
    //     // 2.2) if false, redirect to login, give em a message "invalid credentails"
    // } else { // USER DOES NOT EXIST
    //     // respond back to user, with invalid credentials...
    //     // invalid user so redirect to root/login page
    // }

    // if (err) {
    //   console.log("Error importing user");
    // } else {
    // //   console.log("user => ", user);
    // //   console.log("\n%%%%%%%%% user.first_name=>", user.first_name);
    // }

    if (!user) {
      console.log("no user in db - invalid email!");
      req.flash("login", "INVALID EMAIL");
      res.redirect("/");
    } else if (user.password != req.body.password) {
      req.flash("login", "Wrong password!");
      res.redirect("/");
    } else {
      console.log("success, email came back and pw matches");
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
      console.log("user", user);
      console.log("user._id", user._id);
      console.log("session before", req.session);
      req.session.testing = "TEST TEST TEST";
      req.session.my_id = user._id;
      console.log("session after", req.session);
      //   console.log("req.session.id", req.session.id)
      //   console.log('\n\n =====> req.session.id', req.session.id);

      req.session.first_name = user.first_name;

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

  //   console.log("@@@@@@@@@@@@@@@@@@ \nuserInstance", userInstance);

  userInstance.save(function(err) {
    // RUN VALIDATOR AND SAVE (IF VALIDATOR PASSES)
    // ERRORS
    if (err) {
    //   if (err.errors.first_name) {
    //     // req.flash("first_name_reg_error", err.errors["first_name"].message);
    //   }
    //   if (err.errors.last_name) {
    //     // req.flash("last_name_reg_error", err.errors["last_name"].message);
    //   }
    //   if (err.errors.email) {
    //     // req.flash("email_reg_error", err.errors["email"].message);
    //   }
    //   if (err.errors.password) {
    //     // req.flash("password_reg_error", err.errors["password"].message);
    //   }

      for (var key in err.errors) {
        req.flash("registration", err.errors[key].message);
      }
      res.redirect("/");
    } else {
      // NO ERRORS
      console.log("successfully added a user!");
      //   userInstance.findOne({email: req.body.email}, (err, user) => {
      req.session.first_name = userInstance.first_name;
      //   })
      res.redirect("/success");
    }
  });
});
