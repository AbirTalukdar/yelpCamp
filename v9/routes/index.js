var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//Root Route
router.get("/",function(req,res){
	res.render("landing");
});

//SHOW REGISTER FORM
router.get("/register", function(req,res){
	res.render("register");
});

//Handle Sign Up logic
router.post("/register", function(req,res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			res.render("register");
		}
		passport.authenticate("local")(req,res, function(){
			res.redirect("/campgrounds");
		});
	});
});

// Show login form
router.get("/login", function(req,res){
	res.render("login");
});

//Handel Login Logic
//app.post("/route_name", middleware, callback)//route pattern
router.post("/login", passport.authenticate("local", 
{
	successRedirect: "/campgrounds", 
	failureRedirect:"/login"
}), function(req,res){
	
});

// Logout Route
router.get("/logout", function(req,res){
	req.logout();
	res.redirect("/");
});

//middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;