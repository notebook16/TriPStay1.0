const Listing = require("./models/listing")
const Review = require("./models/review")
const ExpressError = require("./utils/ExpressError.js")
const {listingSchema,reviewSchema} = require("./schema.js");

const review = require("./models/review.js");


module.exports.isLoggedin = (req,res ,next) => {
    if(!req.isAuthenticated())
        {
         //saving redirect url of current session
         req.session.redirectUrl = req.originalUrl;

           req.flash("error", "you mush login first")
           return res.redirect("/login");
        }
     next();   
}


//but passport will automatically delete the old locals on intializing a new session in this case it's login session
//henece we are exporting the redirect url from here and calling it bfore the authentication of login

module.exports.saveRedirectUrl = (req,res,next) =>{
   if( req.session.redirectUrl){
      res.locals.redirectUrl =  req.session.redirectUrl;
   }
   next();
}


module.exports.isOwner = async(req,res,next) => {
       
   let {id} = req.params;
   let listing = await Listing.findById(id);

   if(!listing.owner._id.equals(res.locals.currUser._id)){
       req.flash("error" , "you don't have permission");
       return  res.redirect(`/listings/${id}`);
   }

   next(); //if you are owner then go to next function(route,mw,validate etc)
}


module.exports.validateListing  = (req,res,next) =>{
    let {error}= listingSchema.validate(req.body);
    if(error){
        error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,error);
    }else{
        next()
    }
}


module.exports.validateReview = (req,res,next) =>{
   let {error}= reviewSchema.validate(req.body);
   if(error){
       error.details.map((el) => el.message).join(",");
       throw new ExpressError(400,error);
   }else{
       next()
   }
}



module.exports.isReviewAuthor = async(req,res,next) => {
       
   let {id,reviewId} = req.params;
   let review = await Review.findById(reviewId);

   if(!review.author.equals(res.locals.currUser._id)){
       req.flash("error" , "you don't have permission to delete this review");
       return  res.redirect(`/listings/${id}`);
   }

   next(); //if you are owner then go to next function(route,mw,validate etc)
}
