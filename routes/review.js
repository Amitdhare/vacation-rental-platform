const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const { reviewSchema,  } = require("../schema.js");
const Review = require("../models/reviews.js")
const Listing = require("../models/listing.js");
const { isloggedIn,  isReviewAuthor} = require("../middleware.js");


// review validation
module.exports.validateReview = (req, res, next) => {
    const result = reviewSchema.validate(req.body);
    if (result.error) {

        let errMsg = result.error.detailsq
            .map((el) => el.message)
            .join(",");

        throw new ExpressError(400, errMsg);
        
    };
    next();
}

// post review Route
router.post("/", isloggedIn,  wrapAsync(async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
     console.log(req.body);
    let newReview= new Review(req.body.review);
    // Author save 
     newReview.author = req.user._id;
     console.log(newReview);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}))

// delete review route
router.delete("/:reviewId" ,isloggedIn, isReviewAuthor, wrapAsync(async (req,res )=>{
    let {id , reviewId}=req.params
    await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`)
}))

module.exports= router;