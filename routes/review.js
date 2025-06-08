 const express = require("express");
 const router = express.Router({mergeParams: true});
 const wrapAsync = require("../utils/WrapAsync.js");
 const ExpressError = require("../utils/ExpressError.js");
 const Listing = require("../models/listing.js");
 const Review = require("../models/reviews.js");
 const {validateReview, isLoggedIn, isOwner} = require("../middleware.js")
 const reviewController = require("../controller/review.js")
 
// create route
// or
// Post Route
router.post("/", isLoggedIn ,validateReview , wrapAsync(reviewController.createReview ));


// review
// Delete Route

router.delete("/:reviewId" , isLoggedIn  , wrapAsync( reviewController.deleteReview ) );


module.exports = router;




