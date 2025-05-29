module.exports.isLoggedIn = (req,res,next) => {

    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in to create listing !");
        res.redirect("/login");
    }
    next();
};

module.exports.saveRewdirectUrl = (req,res,next)=>{
    if(res.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};