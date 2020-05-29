var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

var campgrounds=[
		{name:"Salman Greek", image:"https://www.photosforclass.com/download/pixabay-4437756?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F52e4d6444d57aa14f6da8c7dda20367d1c3ed9e04e507441732d73d69f48c0_1280.jpg&user=Chikilino"},
		{name:"Ganite Hult", image:"https://www.photosforclass.com/download/pixabay-3370498?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F55e3d2434e5ba414f6da8c7dda20367d1c3ed9e04e507441732d73d69f48c0_1280.jpg&user=Nickbar"},
		{name:"Mountain Goat's", image:"https://www.photosforclass.com/download/pixabay-2962730?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F54e9d3414d51ac14f6da8c7dda20367d1c3ed9e04e507441732d73d69f48c0_1280.jpg&user=EliasSch"},
	]

app.set("view engine","ejs");
app.get("/",function(req,res){
	res.render("landing");
});

app.get("/campgrounds",function(req,res){
	res.render("campgrounds",{campgrounds:campgrounds});
});

app.post("/campgrounds",function(req,res){
//get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var newCampgrounds = {name: name, image: image};
	campgrounds.push(newCampgrounds);

	//redirect back to campground page
	res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req,res){
	res.render("new");
});

app.listen(3000,function(){
	console.log("YelpCamp Sarver Has Started!!!")
});