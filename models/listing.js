const mongoose = require("mongoose");
const Review = require("./reviews.js");
const { reviewSchema } = require("../schema");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,

    image: {
        filename: {
            type: String,
            default: "listingimage",
        },
        url: {
            type: String,
            default:
                "https://images.pexels.com/photos/37144687/pexels-photo-37144687.jpeg",
        },
    },

    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ]
});

// mongoose middelware

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({_id :{$in:listing.reviews}})
    }
    
});



const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;