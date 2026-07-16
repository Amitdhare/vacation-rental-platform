const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const { reviewSchema,  } = require("../schema.js");
const Review = require("../models/reviews.js")
const Listing = require("../models/listing.js");


// review validation
const validateReview = (req, res, next) => {
    const result = reviewSchema.validate(req.body);
    if (result.error) {

        let errMsg = result.error.details
            .map((el) => el.message)
            .join(",");

        throw new ExpressError(400, errMsg);
        
    };
    next();
}


// post review Route
router.post("/",validateReview ,wrapAsync(async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
     console.log(req.body);
    let newReview= new Review(req.body.review);
     console.log(newReview);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}))

// delete review route
router.delete("/:reviewId" , wrapAsync(async (req,res )=>{
    let {id , reviewId}=req.params
    await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`)
}))

module.exports= router;