const Listing = require("../models/listing.js")


module.exports.home = async (req , res) => {
    const allListings = await  Listing.find({});
    res.render("listings/index.ejs",{allListings});
}

module.exports.index = async (req , res) => {
    const allListings = await  Listing.find({});
    res.render("listings/index.ejs",{allListings});
};


module.exports.renderNewForm = (req,res) => {
    
    res.render("listings/new.ejs");
}


module.exports.showListings = async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path :"reviews",
        populate : {
            path: "author",
    },
})
    .populate("owner");
   
    if(!listing)
    {
        req.flash("error", "Listing not found");
        res.redirect("/listings")

    }

    res.render("listings/show.ejs",{listing});
}


module.exports.createListing = async(req,res, next) => {
    //extracting information because we had us listing as js object in the "new.ejs", which will return the new lsiting details in key-value pair
   
    let url = req.file.path;
    let filename = req.file.filename;
   
    const newListing =  Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url , filename};

    await newListing.save(); //saving into DB

    req.flash("success", "New Listing Created");

    res.redirect("/listings")
    
}


module.exports.renderEditForm = async (req,res) =>{

    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing)
        {
            req.flash("error", "Listing not found");
            res.redirect("/listings")
    
        }


   let originalImageUrl =  listing.image.url;  
   originalImageUrl= originalImageUrl.replace("/upload", "/upload/h_200,w_200/")
    res.render("listings/edit.ejs" , {listing , originalImageUrl});
}


module.exports.updateListing = async (req,res) => {
    if(!req.body.listing)
        {
        throw new ExpressError(400,"send valid data for listing");
        }
    
    let {id} = req.params;
    

    let listing = await Listing.findByIdAndUpdate(id , {...req.body.listing});
    
    if(typeof req.file !== "undefined"){

    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url , filename};

    await listing.save();
    }


    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`)
}


module.exports.destroyeListing = async (req, res) => {
    let { id } = req.params;
    const temp = await Listing.findByIdAndDelete(id); // Correct method
    console.log(temp);
    req.flash("success", "Listing Deleted");

    res.redirect("/listings");
}