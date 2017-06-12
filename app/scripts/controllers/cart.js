'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:CartCtrl
 * @description
 * # CartCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
    .controller('CartCtrl', function(productService) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        var vm = this;
        this.busy = false;
        this.products = [];
        this.loadMore = function() {
            if (vm.busy) {
                return;
            }
            vm.busy = true;
            productService.getProducts(vm.counter, 10)
                .then(function(response) {
                    console.log(response.data);
                    angular.forEach(response.data, function(element) {
                        vm.products.push(element);
                        vm.busy = false;
                    });

                }).catch(function(error) {
                    console.error(error);
                });
            vm.counter++;
            console.log('entering page number ' + vm.counter);
        };
        //this.removeItem: function(itemId){
        //  orderService.removeOrderItem(itemId)
        //.then(function(response){
        //  console.log(response);
        //}).catch(function(error){
        //  console.log(error);
        //})
       // }
    });