const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner} = require("../middleware.js");
const listingController = require("../controllers/listings.js");

const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });



//index route
    router.get("/" , wrapAsync(listingController.index) );
  
//new route
    router.get("/new" , isLoggedIn, listingController.renderNewForm);
  
//show route
    router.get("/:id" ,wrapAsync(listingController.showListing) );
  
//create route     
        router.post("/" , isLoggedIn,upload.single("listing[image]"), wrapAsync(listingController.createListing));

//Edit route
    router.get("/:id/edit" ,isLoggedIn ,isOwner ,wrapAsync(listingController.renderEditForm));
  
//Update Route 
    router.put("/:id" , isLoggedIn ,isOwner ,upload.single("listing[image]"),wrapAsync(listingController.updateListing));
  
//Delete
    router.delete("/:id" , isLoggedIn ,isOwner , wrapAsync(listingController.deleteListing));
  

module.exports = router;