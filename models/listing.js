//here wil make a model/schema for listing
//then we will export this schema which we will use in app.js

//require mongoose
const mongoose  = require("mongoose");
const Schema = mongoose.Schema;
const Review  = require("./review.js");



//creating our Schema
const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
            filename: String,    //accepting image a link
            url: String,
           
            // default : "https://unsplash.com/photos/man-sitting-on-rock-surrounded-by-water--Q_t4SCN8c4",
            //  set: (v) => v === "" ? "https://unsplash.com/photos/man-sitting-on-rock-surrounded-by-water--Q_t4SCN8c4" : v, //seting default value of image

    },
    price : Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],

    owner:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
});

//find by id an find one and delete is same
//t is applied to the Listing schema and will trigger whenever a findOneAndDelete() or findbyIDandDelete operation is performed on a listing.

listingSchema.post("findOneAndDelete" , async(listing) => {
    if(listing) {
        await Review.deleteMany({_id : {$in: listing.reviews }})
    }
})



//creating our model from above Schema
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
