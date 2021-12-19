const express = require("express");
const ejsMate = require("ejs-mate");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const methodOverride = require("method-override");

const campground = require("./models/campground");



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.engine("ejs",ejsMate);  

mongoose.connect("mongodb://localhost:27017/yelp-camp")

/*We are assigning the defa⁡⁢⁣⁣ult mongoose connection to variable db and it will use
mongoose.connect function*/
const db = mongoose.connection;

// db.on("error",console.error.bind(console,"connection error:"));

/* This function will check for specific event when database is running and it will trigger
the function when the event is happened. Like when error then the function is called... */
db.on("error",function(err) {
    console.error(`Error Connecting to Database: ${err}`)
})

/*It will get to the specific event only once like it will call open event only once */
db.once("open", () => {
    console.log("Database Connected");
})

/*Deploying the Website Locally At Port 3000 */
app.listen(3000,() => {
    console.log("Started Server At Port 3000");
})


app.get("/",(req,res) => {
    res.render("home");
})

/****************************************
 * ROUTE TO DISPLAY ALL THE CAMPGROUNDS *
 ****************************************/
 app.get("/campgrounds",async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index",{campgrounds});
 })

 
/************************************
 * ROUTE TO CREATE A NEW CAMPGROUND *
 ************************************/
app.get("/campgrounds/new",(req,res) => {
    res.render("campgrounds/new");
})

/************************************************************************************
 * ROUTE TO SAVE THE CAMPGROUNDS DETAILS WHICH ARE GOING TO CREATE A NEW CAMPGROUND *
 *         OBJECT AND SAVE IT TO DATABASE FROM THE PAGE CAMPGROUNDS/NEW.EJS         *
 ************************************************************************************/
app.post("/campgrounds" ,async (req,res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`campgrounds/${campground._id}`);
})


/*************************************************
 * ROUTE TO DISPLAY SINGLE CAMPGROUND VIA ITS ID *
 *************************************************/
app.get("/campgrounds/:id",async (req,res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show",{ campground });
})


/************************************************
 * ROUTE TO EDIT A SINGLE CAMPGROUND VIA ITS ID *
 ************************************************/
app.get("/campgrounds/:id/edit",async (req,res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit",{campground});
})

/*****************************************************************
 *              ROUTE TO SAVE THE EDITED CAMPGROUND              *
 *   THE RESULT WILL BE CAMPGROUNDS[TITLE],CAMPGROUNDS[LOCATION] *
 *****************************************************************/
app.put("/campgrounds/:id",async (req,res) => {
    const {id} = req.params;
    /*TO REVISE THE TOPIC ... MEANS TO SPREAD THE OBJECT SO THE PASSED OBJECT WILL BE
    CAMPGROUND[TITLE] AND CAMPGROUND[LOCATION] AND WE NEED TO UPDATE IT SO WE NEED
    TO PASS THE WHOLE OBJECT OR THE PARAMETERS WHICH WE WANT TO UPDATE IT.*/
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground},{new:true});
    res.redirect(`/campgrounds/${campground._id}`);  
})


/********************************
 * ROUTE TO DELETE A CAMPGROUND *
 ********************************/
app.delete("/campgrounds/:id", async (req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
})


