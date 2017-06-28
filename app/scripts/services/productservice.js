'use strict';
/**
 * @ngdoc service
 * @name chocoholicsApp.productService
 * @description
 * # productService
 * Factory in the chocoholicsApp.
 */
angular.module('chocoholicsApp')
    .factory('productService', function($http, ENV, $q) {
        // Service logic
        // ...
        var route = '/stock';
        // Public API here
        return {
            getProducts: function(skip, limit, sortBy) {
                var sort;
                sort = sortBy ? sortBy : 'order';
                return $http.get(ENV.serverURL + route + '/products/' + ENV.vendorKey + '?sortBy=' + sort + '&asc=false&skip=' + skip + '&limit=' + limit);
            },
            getProduct: function(id) {
                return $http.get(ENV.serverURL + route + '/product/' + id);
            },
            // FOR IMAGES
            getImages: function(id) {
                var deferred = $q.defer();
                console.log('Searching image with id ' + id);
                var query = new Parse.Query('ProductImages');
                if (id) {
                    query.get(id).then(function(image) {
                        deferred.resolve({
                            id: image.id,
                            thumbnail: image.get('thumbnail').url(),
                            normal: image.get('normal').url(),
                            retina: image.get('retina').url(),
                            hires: image.get('hires').url()
                        });
                    }, function(error) {
                        deferred.reject(error);
                    });
                }
                return deferred.promise;
            }
        };
    });