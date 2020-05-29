var mongooes = require("mongoose");

var campgroundSchema = new mongooes.Schema({
	name: String,
	image: String,
	description: String,
	comments: [
		{
			type: mongooes.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});
module.exports = mongooes.model("Campground", campgroundSchema);
