const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/WrapAsync.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");


// schema validation function MIDDLEWARE
const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);    
    }else {
        next();
    }
};


router.get("/" ,wrapAsync( async (req,res) => {
    const allListings = await Listing.find({});
    res.render('./listings/index.ejs',{allListings});
}));

//  CREATE Route
router.get("/new", isLoggedIn , (req,res)=>{

    res.render("./listings/new.ejs");
    
});

router.post("/", validateListing ,wrapAsync (async (req,res)=>{
    
     const listing = new Listing(req.body.Listing);
       await listing.save();
       req.flash("success" , "new listing created!");
       res.redirect('/listings');
}));

// SHOW Route
router.get("/:id" , wrapAsync( async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
     if (!listing) {
        req.flash("error", "listing you requested for does not exist")
        res.redirect("/listings");
        // Manually trigger an error
    }
    else{
        res.render('./listings/show.ejs',{listing});
    }
   
   
}));


// Edit Route
router.get("/:id/edit", isLoggedIn  ,wrapAsync( async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "listing you requested for does not exist")
        res.redirect("/listings");
        // Manually trigger an error
    }
    else{
    res.render('./listings/edit.ejs',{listing});
    }
}));

// update Route

router.put("/:id", isLoggedIn , validateListing ,wrapAsync( async(req,res)=>{
        let {id} = req.params;
        await Listing.updateOne({_id : id}, {$set: req.body.Listing});
        req.flash("success" , "listing updated successfully")
        res.redirect(`/listings`);
}));

// DELETE ROUTE
router.delete("/:id" , isLoggedIn ,wrapAsync( async(req,res)=>{
        let {id} = req.params;
        let listing = await Listing.findByIdAndDelete(id);
        // console.log(listing);
        req.flash("success" , "listing deleted successfully")
        res.redirect(`/listings`);
}));


module.exports = router;