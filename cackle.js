(function(){
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

	var OPTS = {
		host: 'cackle.me',
		path: '/api',
		port: 80,
		prefix: '/2.0'
	}

	function loadComments (params,done) {
		var commentsPath = '/comment/list.json'
		fetch(params,commentsPath, done);
	}

	function fetch(params, action, done) {

		if (typeof(params) != 'object') {
			throw new Error ('`params` must be an Object');
		}

		if (params.hasOwnProperty('id') == false) {
			throw new Error ('id param is required');
		}

		if (params.hasOwnProperty('accountApiKey') == false) {
			throw new Error ('accountApiKey param is required');
		}

		if (params.hasOwnProperty('siteApiKey') == false) {
			throw new Error ('siteApiKey param is requirad');
		}

		console.log('Cackle: params', params)

		var urlParam = {
			host: OPTS.host,
			port: OPTS.port,
			path: OPTS.path + OPTS.prefix + action + '?' + querystring.stringify(params)
		}		

		http.get(urlParam, function(res) {

			var data = '';	
			res.on('data', function(chunk) {
				data += chunk;
			});
			res.on('end', function() {			
				parseData(data,done);				
			});
		}).on('error', function(err) {
			done(err);
		});	
	}

	function parseData (rawData, done) {
		var json = JSON.parse(rawData);
		done(null,json);
	}
	
	var Cackle = {
		loadComments: loadComments
	};

	module.exports = Cackle;
})();
