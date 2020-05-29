var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongooes = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local");
var Campground = require("./models/campground");
var seedDB = require("./seeds");
 var Comment = require("./models/comment");
 var User = require("./models/user");

seedDB();

mongooes.connect("mongodb://localhost/yelp_camp_v6");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Once again Rusty wins cutest dog!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

// Campground.create({
// 	name:"Ganite Hult", 
// 	image:"https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
// 	description: "This is a huge granite hill, no bathrooms.  No Water. Beautiful granite!!!"
// },function(err,campground){
// 	if(err){
// 		console.log(err);
// 	}
// 	else{
// 		console.log("Newly Created Campground: ");
// 		console.log(campground);
// 	}
// });


app.get("/",function(req,res){
	res.render("landing");
});

app.get("/campgrounds",function(req,res){
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

app.post("/campgrounds",function(req,res){
//get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var description= req.body.description;
	var newCampgrounds = {name: name, image: image, description: description};
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

app.get("/campgrounds/new", function(req,res){
	res.render("campgrounds/new");
});

//Show- show more info about one campground
app.get("/campgrounds/:id", function(req,res){
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
//=========================================
//COMMENTS ROUTES
//=========================================
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req,res){
	//Find Campground By ID
	Campground.findById(req.params.id, function(err,campground){
		if (err){
			console.log(err);
		}else{
			res.render("comments/new", {campground: campground});
		}
	});

});
app.post("/campgrounds/:id/comments", isLoggedIn, function(req,res){
	//lookup campground using ID
	Campground.findById(req.params.id, function(err,campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else{
			//create new comment
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				}else{
					//connect new comment to campground
					campground.comments.push(comment);
					campground.save();
					//redirect campground show page
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
});
//======================
//   AUTH ROUTES
//======================

//SHOW REGISTER FORM
app.get("/register", function(req,res){
	res.render("register");
});
//Handle Sign Up logic
app.post("/register", function(req,res){
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
app.get("/login", function(req,res){
	res.render("login");
});
//Handel Login Logic
//app.post("/route_name", middleware, callback)//route pattern
app.post("/login", passport.authenticate("local", 
{
	successRedirect: "/campgrounds", 
	failureRedirect:"/login"
}), function(req,res){
	
});
// Logout Route
app.get("/logout", function(req,res){
	req.logout();
	res.redirect("/");
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

app.listen(2000,function(){
	console.log("YelpCamp Sarver Has Started!!!")
});