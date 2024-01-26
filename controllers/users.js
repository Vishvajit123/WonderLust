const User = require("../models/user");

// render Signup
module.exports.renderSignup = (request, response) =>{
    response.render("users/signup.ejs");
}

// signup
module.exports.signup = async (request, response) =>{
    try{
        let {username , email, password} = request.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        request.login(registeredUser, (err) =>{
            if(err){
                return next(err);
            }
        request.flash("success", "Welcome to WonderLust!");
        response.redirect("/listings");
            });
    }
    catch(e){
        request.flash("error", e.message);
        response.redirect("/signup");
    }  
    }


// render Login form 
    module.exports.renderLoginForm = (request, response) =>{
        response.render("users/login.ejs");
    }


// Login 
    module.exports.login = async(request, response) => {
        request.flash("success", "Welcome back to WonderLust!");
        let redirectUrl = response.locals.redirectUrl || "/listings";
        response.redirect(redirectUrl);
    }

//logout 
    module.exports.logout = (request, response, next) =>{
        request.logout((err) =>{
            if(err){
                return next(err);
            }
            request.flash("success", "You are Logged out");
            response.redirect("/listings");
        });
    }