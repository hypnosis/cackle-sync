(function (){
	"use strict";

	var Cackle = require('./cackle'),
		extend = require('util')._extend,

		apiCredentials = {}, 
		requestParam = {},

		totalPages,modified, firstPage, lastPage,
		currentPage = 0, 
		size = 100;

		var events = require('events');
	

	function CackleSync() {
    	events.EventEmitter.call(this);
	}

	// Inherit events.EventEmitter
	CackleSync.super_ = events.EventEmitter;
	CackleSync.prototype = Object.create(events.EventEmitter.prototype, {
		constructor: {
			value: CackleSync,
			enumerable: false
		}
	});

	CackleSync.prototype.sync = function (apiParam, options, done) {
		var self = this;
		apiCredentials['id'] = apiParam['id'];
		apiCredentials['siteApiKey'] = apiParam['siteApiKey'];
		apiCredentials['accountApiKey'] = apiParam['accountApiKey'];

		requestParam['page'] = options['page'] || currentPage;
		requestParam['size'] = options['size'] || size;

		Cackle.loadComments(extend(apiCredentials,requestParam),function(err, results){
			if (err) return done(err);

			console.log(results);
			
			currentPage = results.number;
			totalPages  = results.totalPages;
			firstPage   = results.firstPage;
			lastPage    = results.lastPage;


			self.emit('chunk', results);			
		})

		done(null, self);
	}

	module.exports = new CackleSync;
})()