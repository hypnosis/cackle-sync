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
	




syncer.sync(options, function(err, results) {
	if (err) return console.log(err);

	results.on('chunk', function(chunkResults) {

		chunkResults.forEach(function(commentData) {
			commentData['sid'] = commentData['id'];
			delete commentData.id;
			Comment.create(commentData, function (err, comment) {
				console.log('savedComment', comment);
					if (err) return console.log(err);
						//saved
				});	
		})
		
	})

	results.on('end', function() {
		console.log('end')
	})		
})
