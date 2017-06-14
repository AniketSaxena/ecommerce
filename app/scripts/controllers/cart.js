'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:CartCtrl
 * @description
 * # CartCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
    .controller('CartCtrl', function(orderService,localStorageService) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        var vm = this;
        var orderId;
        orderId = localStorageService.get('ObjectId');
        this.busy = false;
        this.items = [];
        this.loadMore = function() {
            if (vm.busy) {
                return;
            }
            vm.busy = true;
            orderService.getOrderItems(orderId)
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
        //});
       // };
       //
    });