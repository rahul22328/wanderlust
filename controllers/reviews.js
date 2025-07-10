const Listing=require("../models/listing");
const Review=require("../models/reviews")
module.exports.createReview=async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).send("Listing not found");
        }

        let newReview = new Review(req.body.review);
        newReview.author=req.user._id;
        listing.reviews.push(newReview);
console.log(newReview);
        await newReview.save();
        await listing.save();
         req.flash("success", "new review created");

        res.redirect(`/listings/${listing._id}`)

}

module.exports.destroyReview=async (req, res) => {
    const { id, reviewId } = req.params;

    // Pull the review ObjectId from the listing
    await Listing.findByIdAndUpdate(
        id,
        { $pull: { reviews: reviewId } }
    );

    // Delete the review document itself
    await Review.findByIdAndDelete(reviewId);
     req.flash("success", "review deleted");

    // Redirect to show page
    res.redirect(`/listings/${id}`);
}
