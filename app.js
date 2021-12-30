const express = require("express");
const ejsMate = require("ejs-mate");
const path = require("path");
const app = express();
const Joi = require("joi");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const methodOverride = require("method-override");
const wrapAsync = require("./utilities/wrapAsync")
const ExpressError = require("./utilities/ExpressError");
const campground = require("./models/campground");
const { campgroundValidateSchema, reviewSchema } = require("./models/validateSchema");
const Review = require("./models/review");
const campgrounds = require("./routes/campground");
const reviews = require("./routes/review");
const session = require("express-session");
const flash = require("connect-flash");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(flash());
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"public")));

const sessionConfig = {
    resave:false,
    saveUninitialized:true,
    secret:"thisshouldbeabettersecret",
    cookie:{
        expires:Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge:1000 * 60 * 60 * 24 * 7,
        httpOnly:true
    }
}
app.use(session(sessionConfig));

app.use((req,res,next) => {
    res.locals.success= req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.engine("ejs", ejsMate);



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
    if (result.error.details) {
        const msg = result.error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}


/**************************************************************************
 * ANOTHER MIDDLEWARE TO CHECK FOR ERRORS IN REVIEW BUT IT IS NOT WORKING *
 **************************************************************************/
const validateReview = (req, res, next) => {
    const result = reviewSchema.validate(req.body);
    if (result.error.details) {
        const msg = result.error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }


}



mongoose.connect("mongodb://localhost:27017/yelp-camp")

/*We are assigning the defa⁡⁢⁣⁣ult mongoose connection to variable db and it will use
mongoose.connect function*/
const db = mongoose.connection;

// db.on("error",console.error.bind(console,"connection error:"));

/* This function will check for specific event when database is running and it will trigger
the function when the event is happened. Like when error then the function is called... */
db.on("error", function (err) {
    console.error(`Error Connecting to Database: ${err}`)
})

/*It will get to the specific event only once like it will call open event only once */
db.once("open", () => {
    console.log("Database Connected");
})


/**************************************************
 * ROUTER OF THE CAMPGROUND FILE IN CAMPGROUND.JS *
 **************************************************/
app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews",reviews);

app.get("/", (req, res) => {
    res.render("home");
})



/******************************************************************************************************
 * CHECKING ALL ROUTES WITH ANY ADDRESS AND IF THIS ROUTE IS CAUGHT THEN CALL MIDDLEWARE WITH ERROR *
 ******************************************************************************************************/
app.all('*', (req, res, next) => {
    // res.send("404 Error...."); 
    next(new ExpressError("Page Not Found", 404));
})

/*********************************************************************************************************
 * MIDDLEWARE OF THE ERROR HANDLING WHICH WILL CALL RENDER WITH THE ERROR STATUS AND AND THE ERROR WHICH *
 *                                              IS PASSED.                                               *
 *********************************************************************************************************/
app.use((err, req, res, next) => {

    //Now we are setting the value of statusCode and that's ok but when we are setting the message
    //default value so we are extracting the err and setting the value so its like go upwards 
    //and then go downwards 
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh no Error Occured...";
    res.status(statusCode).render("error", { err });
    // res.status(statusCode).send(message);    
    // res.send("Something Went Wrong. Please Try Again Later!!!");

})


/*Deploying the Website Locally At Port 3000 */
app.listen(3000, () => {
    console.log("Started Server At Port 3000");
})