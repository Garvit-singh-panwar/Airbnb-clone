const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/WrapAsync.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");




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
router.get("/new" , (req,res)=>{
    res.render("./listings/new.ejs");
})

router.post("/", validateListing ,wrapAsync (async (req,res)=>{
    
     const listing = new Listing(req.body.Listing);
       await listing.save();
       res.redirect('/listings');
}));

// SHOW Route
router.get("/:id" , wrapAsync( async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render('./listings/show.ejs',{listing});
    if (!listing) {
        throw new ExpressError(404, "Listing not found"); // Manually trigger an error
    }
}));


// Edit Route
router.get("/:id/edit" ,wrapAsync( async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render('./listings/edit.ejs',{listing});
}));

router.put("/:id", validateListing ,wrapAsync( async(req,res)=>{
        let {id} = req.params;
        await Listing.updateOne({_id : id}, {$set: req.body.Listing});
        res.redirect(`/listings`);
}));

// DELETE ROUTE
router.delete("/:id" ,wrapAsync( async(req,res)=>{
        let {id} = req.params;
        let listing = await Listing.findByIdAndDelete(id);
        // console.log(listing);
        res.redirect(`/listings`);
}));


module.exports = router;