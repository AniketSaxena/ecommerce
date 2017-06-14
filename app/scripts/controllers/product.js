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
        console.log(this.id);
        this.loadProduct = function(id) {
            productService.getProduct(id)
                .then(function(responese) {
                    console.log(responese.data);
                    vm.product = responese.data;
                });
        };
        this.loadProduct(this.id);
    });