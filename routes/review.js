const express = require("express");
const router = express.Router({mergeParams: true});
const Review = require("../models/review.js")
const Listing = require("../models/listing.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");


//POST Review route
    router.post("/",isLoggedIn, reviewController.createReview);
   
// delete review Route
    router.delete("/:reviewId" ,isLoggedIn,isReviewAuthor, reviewController.deleteReview);

module.exports = router;