const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/expressError.js");
const Listing = require("../models/listing.js");
const { isloggedIn, validateListing,isOwner } = require("../middleware.js");
const { required } = require("joi");
const reviews = require("../models/reviews.js");
const listingControllers = require("../controllers/listings.js")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({storage })

router
    .route("/")
    //index route 
    .get(wrapAsync(listingControllers.index))
    // create new route
   
    .post(isloggedIn,validateListing, upload.single('listing[image]'), wrapAsync(listingControllers.createListing));

    // create route
router.get("/new", isloggedIn,wrapAsync(listingControllers.renderNewform))

router
    .route("/:id")
    // show route
    .get( wrapAsync(listingControllers.showListing))
    // update routes
    .put( isloggedIn ,isOwner,upload.single('listing[image]'),validateListing, wrapAsync(listingControllers.updateListing))
    // delete route
    .delete( isloggedIn,isOwner, wrapAsync(listingControllers.deleteListing));


// edit route
router.get("/:id/edit", isloggedIn, wrapAsync(listingControllers.editListing));

module.exports = router;