'use strict';
/**
 * @ngdoc service
 * @name chocoholicsApp.productService
 * @description
 * # productService
 * Factory in the chocoholicsApp.
 */
angular.module('chocoholicsApp')
    .factory('productService', function($http, ENV, $q, commonService) {
        // Service logic
        // ...
        var route = '/stock';
        // Public API here
        return {
            getProducts: function(skip, limit, category) {
                var sortBy = 'updatedAt';
                var url = ENV.serverURL + route + '/products/' + ENV.vendorKey ;
                var queryParams = {};
                if (skip) {
                    queryParams.skip = parseInt(skip);
                }
                if (limit) {
                    queryParams.limit = parseInt(limit);
                }
                if(sortBy){
                    queryParams.sortBy = sortBy;
                }
                if(category){
                    queryParams.category = category;
                }
                var queryData = commonService.serialize(queryParams);
                console.log(queryData);
                if (queryData) {
                    url = url + '?' + queryData;
                    console.log(url);
                }
                return $http.get(url);
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
            },
            // getCategories: function(){
            //     return $http();
            // }
        };
    });