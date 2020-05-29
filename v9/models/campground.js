var mongooes = require("mongoose");

var campgroundSchema = new mongooes.Schema({
	name: String,
	image: String,
	description: String,
	author: {
		id: {
			type: mongooes.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
		{
			type: mongooes.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});
module.exports = mongooes.model("Campground", campgroundSchema);
