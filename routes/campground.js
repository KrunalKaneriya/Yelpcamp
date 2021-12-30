const express = require("express");
const ExpressError = require("../utilities/ExpressError")
const { campgroundValidateSchema, reviewSchema } = require("../models/validateSchema");
const Campground = require("../models/campground");
const wrapAsync = require("../utilities/wrapAsync");
const router = express.Router();



/************************************
 * MIDDLEWARE TO CHECK FOR ERRORS *
 ************************************/
 const validateCampground = (req, res, next) => {


    //Using Schema.validate And We need To Pass The Data which is to be validated and results 
    //will be stored in the result var
    const result = campgroundValidateSchema.validate(req.body);

    //If there is error.details array then we need to use map function because details is array
    //not the string so we iterate over every details array and we use message and call another
    //method join which joins the strings and pass it to the ExpressError.
    if (result) {
        const msg = result.error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}


/****************************************
 * ROUTE TO DISPLAY ALL THE CAMPGROUNDS *
 ****************************************/
 router.get("/", async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
})


/************************************
 * ROUTE TO CREATE A NEW CAMPGROUND *
 ************************************/
router.get("/new", (req, res) => {
    res.render("campgrounds/new");
})

/************************************************************************************
 * ROUTE TO SAVE THE CAMPGROUNDS DETAILS WHICH ARE GOING TO CREATE A NEW CAMPGROUND *
 *         OBJECT AND SAVE IT TO DATABASE FROM THE PAGE CAMPGROUNDS/NEW.EJS         *
 ************************************************************************************/
router.post("/", wrapAsync(async (req, res, next) => {

    const campground = new Campground(req.body.campground);
    // if(!req.body.campground) throw new ExpressError("Incomplete Data!!!",400);
    await campground.save();
    req.flash("success","Successfully Created A New Campground");
    res.redirect(`campgrounds/${campground._id}`);
}))


/*************************************************
 * ROUTE TO DISPLAY SINGLE CAMPGROUND VIA ITS ID *
 *************************************************/
router.get("/:id", wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate("reviews");
    res.render("campgrounds/show", { campground });
}))


/************************************************
 * ROUTE TO EDIT A SINGLE CAMPGROUND VIA ITS ID *
 ************************************************/
router.get("/:id/edit", wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
}))

/*****************************************************************
 *              ROUTE TO SAVE THE EDITED CAMPGROUND              *
 *   THE RESULT WILL BE CAMPGROUNDS[TITLE],CAMPGROUNDS[LOCATION] *
 *****************************************************************/
router.put("/:id",  wrapAsync(async (req, res) => {
    const { id } = req.params;
    /*TO REVISE THE TOPIC ... MEANS TO SPREAD THE OBJECT SO THE PASSED OBJECT WILL BE
    CAMPGROUND[TITLE] AND CAMPGROUND[LOCATION] AND WE NEED TO UPDATE IT SO WE NEED
    TO PASS THE WHOLE OBJECT OR THE PARAMETERS WHICH WE WANT TO UPDATE IT.*/
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
    req.flash("success","Successfully Updated Campground")
    res.redirect(`/campgrounds/${campground._id}`);
}))


/********************************
 * ROUTE TO DELETE A CAMPGROUND *
 ********************************/
router.delete("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    
    res.redirect("/campgrounds");
}))



module.exports = router;