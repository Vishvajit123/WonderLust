const Listing = require("./models/listing");
const Review = require("./models/review");

module.exports.isLoggedIn = (request, response, next) =>{
//    console.log(request.user);
    if(!request.isAuthenticated()){
        request.session.redirectUrl = request.originalUrl;
        request.flash("error", "You must be Logged in to create Listing!");
       return response.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (request, response, next)=>{
    if(request.session.redirectUrl){
        response.locals.redirectUrl = request.session.redirectUrl;
    }
    next();
};

module.exports.isOwner =async (request, response, next) =>{
    let {id} = request.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(response.locals.currUser._id)){
        request.flash("error" , "You are Not the Owner of This Listings");
        return response.redirect(`/listings/`);
    }
next();
}


module.exports.isReviewAuthor =async (request, response, next) =>{
    let { id , reviewId } = request.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(response.locals.currUser._id)){
        request.flash("error" , "You are Not the Author of this Review");
        return response.redirect(`/listings/`);
    }
next();
}

