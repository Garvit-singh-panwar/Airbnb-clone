const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const port = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");


app.set('view engine' , 'ejs');
app.set('views', path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true ,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 1000*60*60*24*3,
        httpOnly: true, 
    },
}



main()
    .then(()=>{
        console.log("connected to db");
    })
    .catch((err)=>{
        console.log(err);
    });

async function main(){
    await mongoose.connect(MONGO_URL);

}


app.listen(port,()=>{
    console.log(`connected to ${port}`);
})

app.get("/",(req,res)=>{
    res.send("hi , i am root");
})


app.use(session(sessionOptions));
app.use(flash());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    
    res.locals.error = req.flash("error");
    next();
});

app.use("/listings",listings);

app.use("/listings/:id/reviews",reviews)


app.all("*" , (req,res,next)=>{
    next(new ExpressError(404,"page not found"));
})

app.use((err,req,res,next)=>{
    let {statusCode = 500 , message = "Some Error"} = err;
    res.status(statusCode).render("./listings/error.ejs",{message});
})

// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({
//         title: "My new Villa",
//         description: "by the beach",
//         price: 1200,
//         location: "calangute, Goa",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("sucessful testing"); 
// });