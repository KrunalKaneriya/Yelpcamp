const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utilities/wrapAsync")
const Campground = require("../models/campground");
const Review = require("../models/review");

/********************************************
 * ROUTE TO ADD A REVIEW IN A CAMPGROUND ID *
 ********************************************/
 router.post("/", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success","Created Review...");
    res.redirect(`/campgrounds/${id}`);
}))

/***************************************************
 * ROUTE TO DELETE A SPECIFIC REVIEW IN CAMPGROUND *
 ***************************************************/
router.delete("/:reviewid", wrapAsync(async (req, res) => {
    const { id, reviewid } = req.params;

    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await Review.findByIdAndDelete(reviewid);
    req.flash("success","Deleted Review Successfully...");
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;

