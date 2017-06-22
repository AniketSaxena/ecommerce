'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:ProductCtrl
 * @description
 * # ProductCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
    .controller('ProductCtrl', function($stateParams, productService, orderService) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        var vm = this;
        this.product = {};
        this.product.smallImage = "https://placeholdit.co//i/400x400?&text=Random";
        this.product.mediumImage = "https://placeholdit.co//i/800x800?&text=Random";
        this.product.largeImage = "https://placeholdit.co//i/1200x1200?&text=Random";
        this.id = $stateParams.id;
        this.loadProduct = function(id) {
            productService.getProduct(id)
                .then(function(responese) {
                    console.log(responese.data.images);
                    vm.product = responese.data;
                    console.log(vm.product);
                    //  FOR IMAGES
                    vm.loadImages(vm.product.images);
                });
        };

        // FOR IMAGES
        this.loadImages = function(images) {
            angular.forEach(images, function(image) {
                console.log(image.id);
                productService
                    .getImages(image.id)
                    .then(function(image) {
                        console.log(image);
                        vm.images.push(image);
                    }, function(error) {
                        vm.$emit('error', { message: error });
                    });
            });
        };

         this.addItem = function() {
            vm.product.adding = true;
            var item = {
                itemId: vm.product.id,
                quantity: 1
            };
            items = [];
            items.push(item);
            console.log(vm.product);
            if (vm.product.quantity !== 0) {
                vm.product.quantity++;
                orderService.updateOrderItem(vm.product.addedId, vm.product.quantity, null, null, null, orderId)
                    .then(function(response) {
                        console.log(response);
                        // vm.product.adding = false;
                        console.log(vm.product.quantity);
                    }).catch(function(error) {
                        console.log(error);
                        // vm.product.adding = false;
                    });
            } else {
                orderService.addOrderItem(items)
                    .then(function(response) {
                        // console.log(response.data);
                        vm.product.quantity++;
                        orderItemId = response.data;
                        return orderService.linkOrder(orderId, orderItemId);
                    })
                    .then(function(response) {
                        console.log(response);
                        vm.product.adding = false;
                    })
                    .catch(function(error) {
                        console.error(error);
                        vm.product.adding = false;
                    });
            }
        };

        this.loadProduct(this.id);
    });