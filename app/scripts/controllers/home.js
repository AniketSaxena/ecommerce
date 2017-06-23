'use strict';

/**
 * @ngdoc function
 * @name chocoholicsApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
  .controller('HomeCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

	
    // FOR IMAGES OF TOP 3 PRODUCTS
	this.loadImages = function(){
		productService.getImages(imageId)
		.then(function(image){
			console.log(image);
		}).catch(function(error){
			console.log(error);
		});
	};
	//this.loadImages();

  });
