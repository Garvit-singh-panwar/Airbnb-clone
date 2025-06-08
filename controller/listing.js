const Listing = require("../models/listing");

module.exports.index = async (req,res) => {
    const allListings = await Listing.find({});
    res.render('./listings/index.ejs',{allListings});
};

module.exports.renderNewForm = (req,res)=>{

    res.render("./listings/new.ejs");
    
};

module.exports.createListing = async (req,res)=>{
    
     const listing = new Listing(req.body.Listing);
      listing.owner = req.user._id;
       await listing.save();
       req.flash("success" , "new listing created!");
       res.redirect('/listings');
};

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path: "reviews" ,
         populate: {
            path: "author" , 
        }
    } )
    .populate("owner");
     if (!listing) {
        req.flash("error", "listing you requested for does not exist")
        res.redirect("/listings");
        // Manually trigger an error
    }
    else{
        res.render('./listings/show.ejs',{listing});
    }
   
   
};


module.exports.renderEditForm = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "listing you requested for does not exist")
        res.redirect("/listings");
        // Manually trigger an error
    }
    else{
    res.render('./listings/edit.ejs',{listing});
    }
};


module.exports.updateListing =  async(req,res)=>{
        let {id} = req.params;
        await Listing.findByIdAndUpdate(id, {...req.body.Listing});
        req.flash("success" , "listing updated successfully")
        res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async(req,res)=>{
        let {id} = req.params;
        Listing.findById(id);
        let listing = await Listing.findByIdAndDelete(id);
        // console.log(listing);
        req.flash("success" , "listing deleted successfully")
        res.redirect(`/listings`);
};