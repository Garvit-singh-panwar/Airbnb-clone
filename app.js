const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const port = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const Listing = require("./models/listing.js");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/WrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");

// schema validation function MIDDLEWARE
const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);    
    }else {
        next();
    }
};



app.set('view engine' , 'ejs');
app.set('views', path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);




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


// root directory
// app.get("/",(req,res)=>{
//     console.log("connected sucessfully");
// })


// Listing

app.get("/listing" ,wrapAsync( async (req,res) => {
    const allListings = await Listing.find({});
    res.render('./listings/index.ejs',{allListings});
}));

//  CREATE Route
app.get("/listing/new" , (req,res)=>{
    res.render("./listings/new.ejs");
})

app.post("/listing", validateListing ,wrapAsync (async (req,res)=>{
    
     const listing = new Listing(req.body.Listing);
       await listing.save();
       res.redirect('/listing');
}));

// SHOW Route
app.get("/listing/:id" , wrapAsync( async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render('./listings/show.ejs',{listing});
    if (!listing) {
        throw new ExpressError(404, "Listing not found"); // Manually trigger an error
    }
}));


// Edit Route
app.get("/listing/:id/edit" ,wrapAsync( async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render('./listings/edit.ejs',{listing});
}));

app.put("/listing/:id", validateListing ,wrapAsync( async(req,res)=>{
        let {id} = req.params;
        await Listing.updateOne({_id : id}, {$set: req.body.Listing});
        res.redirect(`/listing`);
}));

// DELETE ROUTE
app.delete("/listing/:id" ,wrapAsync( async(req,res)=>{
        let {id} = req.params;
        let listing = await Listing.findByIdAndDelete(id);
        console.log(listing);
        res.redirect(`/listing`);
}));

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