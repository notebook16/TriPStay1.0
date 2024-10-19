const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const {isLoggedin,isOwner,validateListing} = require("../middleware.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage }) //here file in save in uploads folder




//controllers
const listingController = require("../controllers/listing.js")


router.route("/")
    .get(
        wrapAsync(listingController.index))  //all listing, index route
    .post(                                  //create new listing
        isLoggedin, 
        upload.single("listing[image]"),
        validateListing,

        wrapAsync(listingController.createListing)
    );

   


//new route
router.get(
    "/new" , 
    isLoggedin,

    listingController.renderNewForm


);




router.route("/:id")
    .get(              //show route
        wrapAsync(listingController.showListings)  
    )
    .put(           //update route
        isLoggedin,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        
        wrapAsync(listingController.updateListing)
    
    )
    .delete(        //delete route
        isOwner,
        isLoggedin, 
    
        wrapAsync(listingController.destroyeListing)
    
    );




//edit route
router.get("/:id/edit", 
    isOwner,
    isLoggedin,
     wrapAsync(listingController.renderEditForm)
    
);









module.exports = router;