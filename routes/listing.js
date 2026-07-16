const express = require("express");
const router  = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema,reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/expressError.js");
const Listing = require("../models/listing.js");

// add validtaion 
const validateListing = (req, res, next) => {
    const result = listingSchema.validate(req.body);
    if (result.error) {

        let errMsg = result.error.details
            .map((el) => el.message)
            .join(",");

        throw new ExpressError(400, errMsg);
    };
    next()
}
//index route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings })
}))
// create route
router.get("/new", wrapAsync(async (req, res) => {
    res.render("./listings/new.ejs");
}))

// show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing })
}))

// create new route
router.post("/",validateListing, wrapAsync(async (req, res) => {

    const newListing = new Listing(req.body.listing);

    await newListing.save();

    res.redirect("/listings");


}));


// edit route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

// upadte route
router.put("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    res.redirect(`/listings/${id}`)
}));
// delete route

router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let delelted = await Listing.findByIdAndDelete(id);
    console.log(delelted);
    res.redirect("/listings");
}));

module.exports= router;