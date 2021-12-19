const express = require("express");
const app = express();

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
    else {
        res.send("Wrong Password");
    }
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