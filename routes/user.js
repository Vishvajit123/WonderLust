const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const { route } = require("./listing.js");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

// renderSignup
router.get("/signup", userController.renderSignup);

// signup
router.post("/signup",userController.signup);

// renderLogin
router.get("/login" , userController.renderLoginForm);

// Login
router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {
         failureRedirect: "/login" ,
          failureFlash : true,
        }), 
       userController.login 
    );

// Logout
router.get("/logout", userController.logout);


module.exports = router;
