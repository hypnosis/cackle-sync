"use strict";
var http        = require('http'),
	path        = require('path'),
	querystring = require('querystring');

/**
	Cackle model
		@param id {bigint}
		@param channel {text}
		@param comment {text}
		@param date{datetime}
		@param status {integer}
		@param ip {character}
		@param author {character}
		@param email {character}
		@param avatar {character}
		@param is_register {int}
		@param approve {int}
		@param user_agent {character}
**/

module.exports = function Cackle (_config) {
	var that = this;

	var cackleApiUrl = 'http://cackle.me/api/2.0/';




	function loadComments(done) {
		var commentsPath = '/comment/list.json'
		fetch(commentsPath, done);
	}

	function fetch(path, done) {
		var url = path.join(cackleApiUrl, apath);
		console.log(url);
		done();
	}

	return {
		loadComments: loadComments
	}
})
