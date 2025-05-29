const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/WrapAsync.js")
const passport = require("passport");
const { saveRewdirectUrl } = require("../middleware.js");


router.get("/signup" , (req,res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async(req,res) => {
    try{
        let {username,email,password} =  req.body;
        const newUser = new User({email , username});
        const registeredUser = await User.register(newUser , password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
        });
        req.flash("success" , "Welcome to wanderlust!");
        res.redirect("/listings");
    }catch(e){
          req.flash("error" , e.message);
          res.redirect("/signup");
    }
} ));



router.get("/login" , (req,res)=>{
    res.render("./users/login.ejs");
});

router.post("/login",saveRewdirectUrl,
    passport.authenticate("local",{
    failureRedirect: "/login",
    failureFlash: true,
}),
async(req,res)=>{
    req.flash("success" , "welcome back to Wanderlust!");
    let redirecturl = res.locals.redirectUrl || "/listings";
    
    res.redirect(redirecturl);

});


router.get("/logout" , (req,res)=>{
    req.logout((err)=>{
        if(err ){
            next(err);
        }
         req.flash("success" , "ypu are logged out now");
         res.redirect("/listings");
    });
}) ;
   

 module.exports = router;