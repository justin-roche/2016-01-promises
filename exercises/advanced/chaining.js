/******************************************************************
 *                  Advanced Promise Chaining                     *
 ******************************************************************/

var Promise = require('bluebird');
var lib = require('../../lib/advancedChainingHelpers.js');

/**
 * Your task is to write a function that uses a deep learning
 * algorithm to determine the common set of tags between
 * multiple github profile pictures
 * 
 * Given an array of github handles, searchCommonTagsFromGitHubProfiles should:
 *   1) get the public profile associated with each handle
 *   2) extract the avatar_url of each profile
 *   4) get the set of tags for each avatar_url (requires authentication)
 *   5) find the intersection of the tags
 * 
 * Don't worry, much of the heavy lifting has been done already
 * in the `lib` module. You just have to wire everything up together!
 * Here's a list of methods you can access:
 * 
 *   authenticateImageTagger() =>
 *     @return {Promise} - resolves with the token required for tagImage()
 * 
 *   getGitHubProfile(handle) =>
 *     @param {String} handle - the handle of a GitHub user
 *     @return {Promise} - resolves with the user's profile in the following format:
 *       {
 *         handle: 'danthareja',
 *         name: 'Dan Thareja', 
 *         avatarUrl: 'https://avatars.githubusercontent.com/u/6980359?v=3.jpg'
 *       }
 * 
 *   tagImage(imageUrl, token) =>
 *     @param {String|Array} imageUrl - the url(s) of the image you want to tag
 *     @param {String} token - the authentication token
 *     @return {Promise} - resolves with an array of tags
 *        If imageUrl is a string, expect a single array of tags
 *        If imageUrl is an array, expect a nested array of tas
 * 
 *   getIntersection(arrays) =>
 *     @param {Array} arrays - an array of arrays, each containing a set of values
 *     @return {Array} - a single array with the intersection of values from all arrays
 * 
 * Once you pass this one, you'll be a promise chaining master! Have fun!
 * Hint: Bluebird's collection methods could prove handy here
 */

// We're using Clarifai's API to recognize different an image into a list of tags
// Visit the following url to sign up for a free account
//     https://developer.clarifai.com/accounts/login/?next=/applications/
// Then, create a new Application and pass your Client Id and Client Secret into the method below
lib.setImageTaggerCredentials('AtgvEP70QTSTS-D3MrdK1deuL9Urlpt2E_Zjv9ZX', 'hQ0tsiB685P3MLNyo4s4z4SBCohaYGaIqEBOZqct');

var searchCommonTagsFromGitHubProfiles = function(githubHandles) {
	
	var asyncCalls = [];
	githubHandles.forEach(function(v,i){
		asyncCalls.push(lib.getGitHubProfile(v));
	});
	
	asyncCalls.push(lib.authenticateImageTagger());
	var token = null;

	return Promise.all(asyncCalls) //returns values wrapped in promise, so the result has a .then method
	.then(function(d){
		token = d.pop(); 
		return d;                  //returns d wrapped in promise
	})
	.then(function(d){
		return d.map(function(v){
			return v.avatarUrl;
		});
	})
	.then(function(d){
		return d;
	})

						//SCENARIO 1
	//if the returned value is a promise, the promise wrapper adopts its state

/*	.then(function(d){
		console.log(lib.tagImage(d[0],token));
		return lib.tagImage(d[0],token);                   //not a promise...
	})
	.then(function(d){
		console.log(d);                                    //d is a value
		//console.log(d.then(function(v){console.log(v);})); //d.then is not a function!
	})*/

						//SCENARIO 2
	//if the returned value is a value (such as an array), it returns the array as a value

	.then(function(d){
		return d.map(function(v,i){return lib.tagImage(v,token);});   //returns array of promises wrapped in promise 
	})
	.then(function(d){
		//console.log(d);	
		return d;											  
	})


	.then(function(d){
		return Promise.all(d);                                       //returns value wrapped in promise
	})
	.then(function(d){
		//console.log(d);
		return d; 
	})
	.then(function(d){
		//console.log("data: \n" + d);
		var r = lib.getIntersection(d);
		//console.log("result: \n" + r);
		return r;
	});												//if it ends in .then, it returns a promise

	
	
};

// Export these functions so we can unit test them
module.exports = {
  searchCommonTagsFromGitHubProfiles: searchCommonTagsFromGitHubProfiles
};
