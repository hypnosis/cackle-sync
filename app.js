"use strict";

var CackleSync = require('./cackle-sync');
var mongoose = require('mongoose');		

var CONFIG = require('./config.locals');



var syncer = new CackleSync(CONFIG.apiCredentials);
mongoose.connect(CONFIG.mongoURL);

var options = {
	size: 100,
	page: 0
}

var lastModified;

// You can youse your own adapter: sqlite, mysql, mongo, postgres and so on	
var commentSchema = new mongoose.Schema({
		channel: { type: String, index: true },
		message: String,
		sid: {type: Number, unique: true},
		date: { type: Date, index: true },
		status: String,
		ip: String,
		author: Object,
		email: String,
		modified: {type: Number, index: true},				
		user_agent: String			
});

var Comment = mongoose.model('Comment', commentSchema);


// Get LastModified comment
Comment.findOne().sort({modified: -1}).exec(function(err,lastComment){		
	if (err) return console.log(err);
	if (lastComment) {
		options.modified = lastComment.modified;
	}
	sync(console.log);
})


function sync(done) {
	syncer.sync(options, function(err, results) {
		if (err) return done(err);

		results.on('chunk', function(chunkResults) {

			chunkResults.forEach(function(commentData) {
				commentData['sid'] = commentData['id'];
				delete commentData.id;
				Comment.create(commentData, function (err, comment) {						
					if (err) return done(err);
					//saved
				});		
			})
		})

		results.on('end', function() {
			// Finita
			done(null);
		})		
	})
}
