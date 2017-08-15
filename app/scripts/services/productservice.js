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
      getProducts: function(skip, limit, sortBy, category) {
        var url = ENV.serverURL + route + '/products/' + ENV.vendorKey;
        var queryParams = {};
        if (skip) {
          queryParams.skip = parseInt(skip);
        }
        if (limit) {
          queryParams.limit = parseInt(limit);
        }
        if (sortBy) {
          queryParams.sortBy = sortBy;
        }
        if (category) {
          queryParams.category = category;
        }

        queryParams.activeOnly = true;
        var queryData = commonService.serialize(queryParams);
        console.log(queryData);
        if (queryData) {
          url = url + '?' + queryData;
          console.log(url);
        }
        return $http.get(url, { cache: true });
      },
      getProduct: function(id) {
        return $http.get(ENV.serverURL + route + '/product/' + id, { cache: true });
      },
      // FOR IMAGES
      getImages: function(id) {
        var deferred = $q.defer();
        console.log('Searching image with id ' + id);
        var query = new Parse.Query('ProductImages');
        if (id) {
          query.get(id).then(function(image) {

            var imgObject = {
              thumbnail: image.get('thumbnail').url(),
              normal: image.get('normal').url(),
              retina: image.get('retina').url(),
              hires: image.get('hires').url()
            };

            _.each(imgObject, function(value, key) {
              imgObject[key] = value.replace(/^http:\/\//i, 'https://');
            });

            deferred.resolve({
              id: image.id,
              thumbnail: imgObject.thumbnail,
              normal: imgObject.normal,
              retina: imgObject.retina,
              hires: imgObject.hires
            });
          }, function(error) {
            console.error(error);
            deferred.reject(error);
          });
        }
        return deferred.promise;
      },
      getCount: function(category) {
        var deferred = $q.defer();


        var query = new Parse.Query('Product');
        query.equalTo('vendor', ENV.vendorKey);
        query.equalTo('active', true);
        if (category) {
          query.equalTo('category', category);
        }

        query
          .count()
          .then(function(count) {
            deferred.resolve(count);
          })
          .catch(function(error) {
            console.error(error);
            deferred.reject(error);
          });

        return deferred.promise;

      }
    };
  });
