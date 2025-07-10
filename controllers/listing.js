const { Query } = require("mongoose");
const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});
module.exports.index = async (req, res) => {
    const { category } = req.query;

    let filter = {};
    if (category) {
        filter.category = category;
    }

    const alllistings = await Listing.find(filter);
    res.render("listings/index.ejs", { alllistings });
};

module.exports.renderNewForm = (req, res) => {

    res.render("listings/new"); // no .ejs, correct folder
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author", }, }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested does't exist");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });

}
module.exports.createListing = async (req, res, next) => {
    try {
        let response = await geocodingClient
            .forwardGeocode({
                query: req.body.listing.location,
                limit: 1,
            })
            .send();

        // Check if location was found
        if (!response.body.features.length) {
            req.flash("error", "Invalid location. Please enter a valid place.");
            return res.redirect("/listings/new");
        }

        // Extract geometry
        const geoData = response.body.features[0].geometry;

        // Upload image
        let url = req.file.path;
        let filename = req.file.filename;

        // Create listing
        const newlisting = new Listing(req.body.listing);
        newlisting.owner = req.user._id;
        newlisting.image = { url, filename };
        newlisting.geometry = {
            type: "Point",
            coordinates: geoData.coordinates
        };

        await newlisting.save();
        req.flash("success", "New listing created");
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
};


module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
     if(!listing){
        req.flash("error","listing you requested does't exist")
       return  res.redirect("/listings")
    }
    res.render("listings/edit.ejs",{listing});
}

module.exports.updateListing=async(req,res)=>{
    let{id}= req.params;
   let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
   listing.image={url,filename};
   await listing.save();
}
    res.redirect(`/listings/${id}`)
}


module.exports.deleteListing=async(req,res)=>{
    let{id}=req.params;
    let deleted=await Listing.findByIdAndDelete(id);
    console.log(deleted);
     req.flash("success", "new listing deleted");
    res.redirect("/listings")
}