const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const {validateReview, isLoggedin , isReviewAuthor} = require("../middleware.js");


const reviewController = require("../controllers/reviews.js");


//reviews route

router.post("/" , 
    isLoggedin,
    validateReview ,
    wrapAsync(reviewController.createReview));


//delete review route
router.delete("/:reviewId",
    isLoggedin,
    isReviewAuthor,
    
    wrapAsync(reviewController.destroyeReview));

module.exports = router;