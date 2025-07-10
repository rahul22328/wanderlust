const express=require("express");
const router = express.Router({ mergeParams: true }); 
const wrapAsync=require("../utills/wrapAsync.js");
const ExpressError=require("../utills/ExpressError.js");
 const { listingSchema, reviewSchema } = require('../schema.js');
const Listing=require("../models/listing.js")
 const Review=require("../models/reviews.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const ReviewController=require("../controllers/reviews.js")



 


  const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    console.log("REQ.BODY = ", req.body);
    if (error) {
        console.log("JOI ERROR = ", error);
        const mesg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, mesg);
    }
    next();
};



//reviews 
//post review route 
router.post("/", isLoggedIn, validateReview,wrapAsync (ReviewController.createReview))

//delete review Route
router.delete("/:reviewId", isLoggedIn,isReviewAuthor,wrapAsync(ReviewController.destroyReview));

module.exports=router;