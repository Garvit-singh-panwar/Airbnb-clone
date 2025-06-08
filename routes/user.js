const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/WrapAsync.js")
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/user.js");


router.route("/signup")
// render signup form route
.get( userController.renderSignupForm )
// user signup route
.post( wrapAsync( userController.Signup));



router.route("/login")
// render login form route
.get( userController.renderLoginForm)
// login  user route
.post( saveRedirectUrl,
    passport.authenticate("local",{
    failureRedirect: "/login",
    failureFlash: true,
}),
userController.Login
);




router.get("/logout" , userController.logout ) ;
   

 module.exports = router;