'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
  .controller('HomeCtrl', function($scope, productService) {
    var vm = this;
    this.products = [];



    this.loadImages = function(images, index) {
      productService.getImages(images[0].objectId).then(function(image) {
          vm.products[index].image = image;
          console.log(vm.products[index]);
        })
        .catch(function(error) {
          console.error(error);
          $scope.$emit('handleError', { error: error });
        });
    };


    this.getTopProducts = function() {
      productService.getProducts(0, 4, 'updatedAt', null)
        .then(function(response) {
          angular.forEach(response.data, function(element, index) {
            vm.products.push(element);
            if (element.images && element.images.length) {
              vm.loadImages(element.images, index);
            }
          });
        })
        .catch(function(error) {
          $scope.$emit('handleError', { error: error });

          console.log(error);
        });
    };


    this.pre = function() {

      // To show top of page when page loads
      $(document).ready(function() {
        $(this).scrollTop(0);
      });
      
      vm.imageOptions = {
        nolazy: true,
        background: false,
        imgAttrs: [{
          class: 'img-responsive animated fadeInBig'
        }]
      };

      vm.getTopProducts();
    };

    this.pre();

  });
