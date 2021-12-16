const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const Campground = require("./models/campground");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

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

/*Get Route to Make a new c */
app.get("/makeCampground",async (req,res) => {
    const camp = new Campground({title:'Backyard',description:'cheap camp'});
    await camp.save();
    res.send(camp);
})