var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

router.get("/",function(req,res){
	//Get all Campgrounds from DB
	Campground.find({}, function(err,allCampgrounds){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds/campgrounds",{campgrounds:allCampgrounds, currentUser: req.user});
		}
	});
	
});

router.post("/", isLoggedIn, function(req,res){
//get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var description= req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampgrounds = {name: name, image: image, description: description, author: author};
	//create a new campground and save to DB
	Campground.create(newCampgrounds, function(err, newlyCreated){
		if(err){
			console.log(err);
		}
		else{
			//redirect back to campground page
			res.redirect("/campgrounds");
		}
	});
});

router.get("/new", isLoggedIn, function(req,res){
	res.render("campgrounds/new");
});

//Show- show more info about one campground
router.get("/:id", function(req,res){
	//find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground){
		if(err){
			console.log(err);
		}else{
			console.log(foundCampground);
			//render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
	//req.params.id
});

//Edit Campground Route
router.get("/:id/edit", checkCampgroundOwnership ,function(req,res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit",{campground: foundCampground});
	});
});
//Update Campground Route
router.put("/:id", checkCampgroundOwnership ,function(req, res){
	//find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			//redirect Somewhere(Show Page)
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

router.delete("/:id",checkCampgroundOwnership , function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	});
});

//middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}
function checkCampgroundOwnership(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				res.redirect("back");
			}else{
				//does the user own the campground
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				}else{
					res.redirect("back");
				}
			}
		});
	}else{
		res.redirect("back");
	}
}

module.exports = router;