const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/expressError.js");
const Listing = require("../models/listing.js");
const { isloggedIn,validateListing } = require("../middleware.js");
const { required } = require("joi");
const reviews= require("../models/reviews.js");
const listingControllers = require("../controllers/listings.js")


//index route
router.get("/", wrapAsync(listingControllers.index))


// create route
router.get("/new", isloggedIn, wrapAsync(listingControllers.renderNewform))

// show route
router.get("/:id", wrapAsync(listingControllers.showListing))

// create new route
router.post("/", validateListing, wrapAsync(listingControllers.createListing));


// edit route
router.get("/:id/edit", isloggedIn, wrapAsync(listingControllers.editListing));

// update route
router.put("/:id", isloggedIn, wrapAsync(listingControllers.updateListing));
// delete route

router.delete("/:id", isloggedIn, wrapAsync(listingControllers.deleteListing));

module.exports = router;