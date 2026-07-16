const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");

const listings= require("./routes/listing.js");
const reviews = require("./routes/review.js");


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
app.use("/listings", listings)

app.use("/listings/:id/reviews", reviews)


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