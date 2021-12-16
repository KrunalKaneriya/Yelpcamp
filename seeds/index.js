/*****************************************************
 * FILE FOR ADDING RANDOM DATA FROM ARRAY OF OBJECTS *
 *                    AND STRINGS                    *
 *****************************************************/

const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const {descriptors,places} = require("./seedHelpers");

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

/****************************************************************************
 * FUNCTION THAT TAKES ARRAY AS ARGUMENT AND RETURNS RANDOM NUMBER IN ARRAY *
 *                     LOCATION => ARRAY[RANDOMNUMBER]                      *
 ****************************************************************************/
const sample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async() => {
    await Campground.deleteMany({});
    for(let i=0;i<50;i++) {
        const random = Math.floor(Math.random()*1000);
        const data = new Campground({
            location: `${cities[random].city} , ${cities[random].state}`,
            title:`${sample(descriptors)} ${sample(places)}`
        })
        await data.save();
    }
}

/****************************************************************************
 * THIS FUNCTION RETURN A PROMISE SO WE CAN CLOSE THE CONNECTION AFTER THAT *
 *                  SO WE DON'T NEED TO CLOSE IT MANUALLY                   *
 ****************************************************************************/
seedDB().then(() => {
    db.close();
})