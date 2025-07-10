const express = require("express");
const router = express.Router();
const wrapAsync = require("../utills/wrapAsync.js");
const ExpressError = require("../utills/ExpressError.js");
const { listingSchema } = require('../schema');
const Listing = require("../models/listing.js");
const { isLoggedIn, isowner } = require("../middleware.js");
const ListingController = require("../controllers/listing.js");

const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// ✅ FIXED: middleware must be in the right order and syntax
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    console.log("REQ.BODY = ", req.body);
    if (error) {
        console.log("JOI ERROR = ", error);
        const mesg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, mesg);
    }
    next();
};

router
  .route("/")
  .get(wrapAsync(ListingController.index))
  // ✅ FIXED: call upload.single('listing[image]') with the correct field name
  .post(
    isLoggedIn,
    upload.single('listing[image]'),  // must be BEFORE validateListing
    validateListing,
    wrapAsync(ListingController.createListing)
  );

router.get("/new", isLoggedIn, ListingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(ListingController.showListing))
  // ✅ FIXED: same correction here
  .put(
    isLoggedIn,
    isowner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(ListingController.updateListing)
  )
  .delete(isLoggedIn, isowner, wrapAsync(ListingController.deleteListing));

router.get("/:id/edit", isLoggedIn, isowner, wrapAsync(ListingController.renderEditForm));

module.exports = router;
