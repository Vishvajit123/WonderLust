const Listing = require("../models/listing");
const Review = require("../models/review");

// create review
module.exports.createReview = async (request , response ) => {
    let listing = await Listing.findById(request.params.id);
    let newReview = new Review(request.body.review);
    newReview.author = request.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
   
    await newReview.save();
    await listing.save();
    request.flash("success" , "Created Review");
    response.redirect(`/listings/${listing._id}`);
};

// delete review
module.exports.deleteReview = async (request, response) =>{
    let { id, reviewId } = request.params;
   
    await Listing.findByIdAndUpdate(id , {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    request.flash("success" , "Deleted Review");
    response.redirect(`/listings/${id}`);   
};