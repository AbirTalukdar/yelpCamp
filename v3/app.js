var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongooes = require("mongoose");
var Campground = require("./models/campground");
var seedDB = require("./seeds");
// var Comment = require("./models/comment");
// var User = require("./models/user");

seedDB();

mongooes.connect("mongodb://localhost/yelp_camp_v3");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");



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
			res.render("campgrounds",{campgrounds:allCampgrounds});
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
	res.render("new");
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
			res.render("show", {campground: foundCampground});
		}
	});
	//req.params.id
});

app.listen(2000,function(){
	console.log("YelpCamp Sarver Has Started!!!")
});