const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/WrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner , validateListing } = require("../middleware.js");
const listingController = require("../controller/listing.js")
const multer = require('multer');
const {storage} = require("../cloudConfig.js")
const upload = multer({storage});


// index route

router.route("/")
.get(wrapAsync(listingController.index ))
// create route
.post( isLoggedIn,
    upload.single('Listing[image]') ,
    validateListing,
    wrapAsync (listingController.createListing )
);




//  CREATE Route
router.get("/new", isLoggedIn , listingController.renderNewForm );


router.route("/:id")
// Show Route
.get( wrapAsync(listingController.showListing))
// update Route
.put(
       isLoggedIn,
       isOwner,
       upload.single('Listing[image]') ,
       validateListing ,
       wrapAsync(listingController.updateListing))
// Delete Route 
.delete(isLoggedIn,
    isOwner ,wrapAsync( listingController.deleteListing))  ;


// Edit Route
router.get("/:id/edit",
    isLoggedIn ,
    isOwner   ,
    wrapAsync(listingController.renderEditForm ));



module.exports = router;