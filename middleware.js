const Listing=require("./models/listing");
const Review  = require("./models/reviews");
module.exports.isLoggedIn = (req, res, next) => {

    console.log(req.user)
    if (!req.isAuthenticated()) {
        req.session.redirectUrl=req.originalUrl;
        req.flash("error", "You must be logged in to create a listing");
        return res.redirect("/login");
    }
    next(); // ✅ This moves the request forward if the user is logged in
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl
    }
    next();
}

module.exports.isowner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
        if(!listing.owner.equals(res.locals.curruser._id)){
            req.flash("error","You dont have permissio to edit");
           return  res.redirect(`/listings/${id}`);
        }
        next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
  // get both params that your routes usually have: /listings/:id/reviews/:reviewId
  const { id, reviewId } = req.params;

  const review = await Review.findById(reviewId);

  // review.author is an ObjectId → compare directly
  if (!review.author.equals(res.locals.curruser._id)) {
    req.flash("error", "You are not the author of this review");
    return res.redirect(`/listings/${id}`);   // use the listing id from params
  }

  // user is the author → proceed
  next();
};
