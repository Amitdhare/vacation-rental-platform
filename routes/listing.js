const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/expressError.js");
const Listing = require("../models/listing.js");
const { isloggedIn,validateListing } = require("../middleware.js");
const { required } = require("joi");
const reviews= require("../models/reviews.js");



//index route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings })
}))
// create route
router.get("/new", isloggedIn, wrapAsync(async (req, res) => {
    res.render("./listings/new.ejs");
}))

// show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
   
    
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist")
        res.redirect("/listings");
    } else {

        res.render("listings/show.ejs", { listing })
    }
}))

// create new route
router.post("/", validateListing, wrapAsync(async (req, res) => {

    const newListing = new Listing(req.body.listing);
     newListing.owner= req.user._id
    await newListing.save();
    req.flash("success", "new listing created!")

    res.redirect("/listings");


}));


// edit route
router.get("/:id/edit", isloggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    req.flash("success", "edit listing!")
    res.render("listings/edit.ejs", { listing });
}));

// update route
router.put("/:id", isloggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    req.flash("success", " listing updated!")
    res.redirect(`/listings/${id}`)
}));
// delete route

router.delete("/:id", isloggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let delelted = await Listing.findByIdAndDelete(id);
    console.log(delelted);
    req.flash("success", " listing delete!")
    res.redirect("/listings");
}));

module.exports = router;