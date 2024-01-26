require('dotenv').config();
// console.log(process.env.secret);


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const dbUrl = process.env.ATLASDB_URL;
const session = require("express-session");
const MongoStore = require('connect-mongo');

const flash = require("connect-flash");
const wrapAsync = require("./utils/wrapAsync.js");

const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");


const store =  MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret : process.env.SECRET,
  },
  touchAfter: 24 * 3600,
})

store.on("error", () =>{
  console.log("ERROR in MONGO SESSION STORE" , err);
})


const sessionOptions = {
  store,
  secret : process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge : 7 * 24 * 60 * 60 * 1000,
    httpOnly : true, 
  }
};
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));    //authenticate()  - it generate a fun that used in pass local strartgy
passport.serializeUser(User.serializeUser());    //store user related info
passport.deserializeUser(User.deserializeUser());  //unstore the user related data


// flash
app.use((req, res, next) =>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();  
});




////////////////////////////////////////////////////
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// path
const path = require("path");
const review = require("./models/review.js");
const { request } = require("http");
app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate );
app.use(express.static(path.join(__dirname, "/public")));


// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

///////////////////////////////////////////////////////////

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}
//////////////////////////////////////////////////

const port = 3015;
app.listen(port , ()=>{
    console.log(`app is listining on port no : ${port}`);
});

//////////////////////////////////////////////////////

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/" , userRouter);

/////////////////////////////////////////////////////

app.use((error, request, response, next) =>{
  let {statusCode = 500, message = "Something went Wrong!"} = error;
    response.status(statusCode).send(message);
})


