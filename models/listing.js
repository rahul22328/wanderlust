const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review=require("./reviews.js")
const placeholder =
  "https://images.unsplash.com/photo-1505678261036-a3fcc5e884ee"
  + "?auto=format&fit=crop&w=800&q=80";

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  image: {
    filename: { type: String, default: "placeholder.jpg" },
    url: {
      type: String,
      default: placeholder,
      set: v => (v === '' ? undefined : v)   // ⭐️ magic line
    }
  },
  price: Number,
  location: String,
  country: String,
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  },
 geometry: {
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],     // [longitude, latitude]
    required: true
  }
},
category: {
  type: String,
  enum: [
    'trending',
    'rooms',
    'iconic-cities', // ✅ fixed
    'mountains',
    'castles',
    'arctic-pools',  // ✅ fixed
    'camping',
    'farms',
    'snows'
  ]
}


});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in: listing.reviews}})
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
