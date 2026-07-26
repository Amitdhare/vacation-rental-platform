const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const Review = require("../models/reviews.js")
const Listing = require("../models/listing.js");
const { isloggedIn,  isReviewAuthor , validateReview} = require("../middleware.js");
const reviewsControllers = require("../controllers/reviews.js")
// post review Route
router.post("/",  isloggedIn, validateReview, wrapAsync(reviewsControllers.createReview))

// delete review route
router.delete("/:reviewId" ,isloggedIn, isReviewAuthor,  wrapAsync(reviewsControllers.destroyReview))

module.exports= router;