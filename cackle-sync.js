(function (){
	"use strict";

	var Cackle = require('./cackle'),
		extend = require('util')._extend,

		apiCredentials = {}, 
		requestParam = {},

		totalPages,modified, firstPage, lastPage,
		currentPage = 0, 
		size = 100,
		WAIT = 500,
		self;

		var events = require('events');
	

	function CackleSync(apiParam) {
		self = this;

		apiCredentials['id'] = apiParam['id'];
		apiCredentials['siteApiKey'] = apiParam['siteApiKey'];
		apiCredentials['accountApiKey'] = apiParam['accountApiKey'];

		this.apiCredentials = apiCredentials
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

	CackleSync.prototype.sync = function (options, done) {
		this.fetch(options);
		done(null, self);
	}

	CackleSync.prototype.fetch = function(params) {
		
		extend(requestParam,params);
		extend(requestParam,this.apiCredentials);
		requestParam['page'] = params['page'] || currentPage;
		requestParam['size'] = params['size'] || size;

		return Cackle.loadComments(requestParam,this.onLoaded.bind(this)); // Return Cackle object promise
	}

	CackleSync.prototype.onLoaded = function(err, results) {
		self = this;
		if (err) return done(err);

		// console.log(results);
		
		currentPage = parseInt(results.comments.number);
		totalPages  = parseInt(results.comments.totalPages);
		firstPage   = results.comments.firstPage;
		lastPage    = results.comments.lastPage;
		var chunkedComments = results.comments.content;

		self.emit('chunk', chunkedComments);
		console.log(currentPage, totalPages)

		if (currentPage < 4) {
			
			console.log('more?')
			requestParam['page'] = ++currentPage;
			console.log('CackleSync',requestParam);
			setTimeout(function() {
				Cackle.loadComments(requestParam, this.onLoaded.bind(self))
			}.bind(self), WAIT);
			
			
		} else {
			self.emit('end');
		}
	}

	module.exports = CackleSync;
})()