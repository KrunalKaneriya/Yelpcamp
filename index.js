const express = require("express");
const app = express();
const AppError = require("./Apperror")

app.listen(3000,() => {
    console.log("Started Server At Port 3000");
})

app.use("/dogs",(req,res,next) => {
    console.log("Came At First Middleware");
    next();
})

const verifyPassword = (req,res,next) => {
    console.log("Checking Password");
    const {password} = req.query;
    if(password==="hello") {
        next();
    }
    throw new AppError(401,"Password Required");
}

app.get("/secret",verifyPassword,(req,res)=> {
    res.send("Password is Right")
})
app.get("/" ,(req,res) => {
    res.send("Home Route");
})

app.get("/dogs",(req,res)=> {
    res.send("Woof Woof");
})

app.get("/error",(req,res) => {
    chicken.fly();
    throw new AppError(201,"Chicken Error");
})

app.get("/admin",(req,res)=> {
    throw new AppError(403,"You Are Not an Admin");
})

// app.use((err,req,res,next) => {
//     console.log(err);
//     res.status(500).send("Oh Boy We Got Error");
//     next(err);
// })

app.use((err,req,res,next) => {
    // console.log(err);
    // console.dir(err);
    const { status = 500, message = "Something Went Wrong"  } = err;
    res.status(status).send(message);
}) 