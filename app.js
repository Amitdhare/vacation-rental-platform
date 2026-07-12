const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");
const wrapAsync = require("./utils/wrapAsync.js");
const { listingSchema,reviewSchema } = require("./schema.js");
const Review = require("./models/reviews.js");




let mongo_url = 'mongodb://127.0.0.1:27017/wanderlust';
main().catch((err) => {
    console.log(err);
})
async function main() {
    await mongoose.connect(mongo_url);


}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
    res.send(" i am a root");
})

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



// app.get("/testListing", (req,res)=>{
//     const sampleListing= new Listing({
//         title:"my name is villna ",
//         description:"by the beach",
//         price: 1200,
//         location:"calangute, goa",
//         country: "India"

//     });
//     sampleListing.save() .then((res)=>{
//         console.log(res);

//     }) .catch((err)=>{
//         console.log(err);

//     });
//     console.log("sample was save");
//         res.send("success full testing")
// });

//index route

app.get("/listing", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings })
}))
// create route
app.get("/listings/new", wrapAsync(async (req, res) => {
    res.render("./listings/new.ejs");
}))

// show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing })
}))

// create new route
app.post("/listing",validateListing, wrapAsync(async (req, res) => {

    const newListing = new Listing(req.body.listing);

    await newListing.save();

    res.redirect("/listing");


}));


// edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

// upadte route
app.put("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    res.redirect(`/listings/${id}`)
}));
// delete route

app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let delelted = await Listing.findByIdAndDelete(id);
    console.log(delelted);
    res.redirect("/listing");
}));

// reviews
// post review Route
app.post("/listings/:id/reviews",validateReview ,wrapAsync(async (req,res)=>{
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
app.delete("/listings/:id/reviews/:reviewId" , wrapAsync(async (req,res )=>{
    let {id , reviewId}=req.params
    await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`)
}))


app.use((req, res, next) => {
    next(new ExpressError(404, "page not found"))
});




app.use((err, req, res, next) => {
    let { statusCode = 500, message = "samething went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });

})

app.listen(8080, () => {
    console.log("Service is listing to port 8080");
});