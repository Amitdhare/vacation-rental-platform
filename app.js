const express= require("express");
const app = express();
const mongoose= require("mongoose");
const Listing=  require("./models/listing.js");
const path = require("path");
const methodOverride= require("method-override");
const ejsMate= require("ejs-mate");


let mongo_url = 'mongodb://127.0.0.1:27017/wanderlust';
main() .catch((err)=>{
    console.log(err);
})
async function main() {
  await mongoose.connect(mongo_url);


}
app.set("view engine", "ejs");
app.set("views",path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname ,"/public")));

app.get("/", (req,res)=>{
    res.send(" i am a root");
})



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
app.get("/listing", async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings})
})
// create route
app.get("/listings/new" ,async (req,res) => {
    res.render("./listings/new.ejs" );
})

// show route
app.get("/listings/:id",async (req ,res )=>{
     let {id}= req.params;
     const listing= await Listing.findById(id);
     res.render("listings/show.ejs", {listing})
})

// create new route
app.post("/listing",async (req,res)=>{
      const newListing= new Listing(req.body.listing);
       console.log(newListing);
      await newListing.save();
      res.redirect("/listing");
})

// edit route
app.get("/listings/:id/edit", async (req,res)=>{
     let {id}= req.params;
     const listing= await Listing.findById(id);
     res.render("listings/edit.ejs", {listing});
});

// upadte route
app.put("/listings/:id", async (req, res) => {
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing})
    res.redirect(`/listings/${id}`);

});

app.delete("/listings/:id",async (req,res)=>{
    let {id}= req.params;
    let delelted = await Listing.findByIdAndDelete(id);
    console.log(delelted);
    res.redirect("/listing");
})


app.listen(8080,()=>{
    console.log("Service is listing to port 8080");
});