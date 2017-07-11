'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
    .controller('HomeCtrl', function(productService) {
        var vm = this;
        this.products = [];
        this.getTopProducts = function() {
            productService.getProducts(0, 4, 'updatedAt', null)
                .then(function(response) {
                    // console.log(response.data);
                    angular.forEach(response.data, function(element) {
                        vm.products.push(element);
                    });
                })
                .catch(function(error) {
                    console.log(error);
                });
        };

        // FOR IMAGES OF TOP 3 PRODUCTS
        this.loadImages = function() {
            productService.getImages(imageId)
                .then(function(image) {
                    console.log(image);
                }).catch(function(error) {
                    console.log(error);
                });
        };
        //this.loadImages();
        this.getTopProducts();
    });