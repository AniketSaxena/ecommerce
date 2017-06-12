'use strict';
/**
 * @ngdoc service
 * @name chocoholicsApp.productService
 * @description
 * # productService
 * Factory in the chocoholicsApp.
 */
angular.module('chocoholicsApp')
    .factory('productService', function($http , ENV) {
        // Service logic
        // ...
        var route = '/stock';
        // Public API here
        return {
            getProducts: function(skip,limit) {
                return $http.get(ENV.serverURL+route+'/products/'+ENV.vendorKey+'?sortBy=updatedAt&asc=false&skip='+skip+'&limit='+limit);
            },
            getProduct: function(id){
                return $http.get(ENV.serverURL+route+'/product/'+id);
            }
        };
    });