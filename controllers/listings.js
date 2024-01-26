const Listing = require("../models/listing");

// index route
    module.exports.index = async (request, response) =>{
        const allListings = await Listing.find({});
        response.render("listings/index.ejs", {allListings});
    };

// create route backend
    module.exports.renderNewForm = (request, response) =>{
        response.render("listings/new.ejs");
        }

// show route
    module.exports.showListing = (async (request, response)=>{
        let {id} = request.params;
        const listing = await Listing.findById(id).populate({path : "reviews" ,populate: {path: "author"} })
                                                    .populate("owner");
        if(! listing){
        request.flash("error", "Listing you requested for Dose Not Exist!");
        response.redirect("/listings");
    }
        else{
        console.log(listing);
        response.render("listings/show.ejs", {listing})
    }    
    })


// post route 

    module.exports.createListing = (async (request, response, next) =>{
        let url = request.file.path;
        let filename = request.file.filename;
        const newListing = new Listing(request.body.listing);
    // listing owner
        newListing.owner = request.user._id;
        newListing.image = {url, filename};
        await newListing.save();
        request.flash("success" , "New Listing Created!");
        response.redirect("/listings");
        // console.log(listing);
    })


// edit route 
    module.exports.renderEditForm = (async (request, response)=>{
        let {id} = request.params;
        const listing = await Listing.findById(id);
        // flash -error
        if (!listing) {
        request.flash("error", "Listing you requested for Dose Not Exist!");
        response.redirect("/listings");
    }
        else{      
        response.render("listings/edit.ejs", {listing})
    }
    })


// update listing
    module.exports.updateListing = async (request, response) =>{
        let {id} = request.params;
        let listing = await Listing.findByIdAndUpdate(id, {...request.body.listing}); 
        if (typeof request.file !== "undefined"){
        let url = request.file.path;
        let filename = request.file.filename;
        listing.image = { url, filename };
        await listing.save();
        }
        request.flash("success" , "Updated Your Listing");
        response.redirect(`/listings/${id}`);
        };


// delete listing
    module.exports.deleteListing =async (request, response) =>{
        let {id} = request.params;
        let deletedListing = await Listing.findByIdAndDelete(id);
        console.log(deletedListing);
        request.flash("success" , "Deleted Your Listing");
        response.redirect("/listings");
    };