'use strict';
/**
 * @ngdoc service
 * @name chocoholicsApp.commonservice
 * @description
 * # commonservice
 * Service in the chocoholicsApp.
 */
angular.module('chocoholicsApp')
    .service('commonService', function() {
        // AngularJS will instantiate a singleton by calling "new" on this function

        return {
            serialize: function(obj) {
                var str = [];
                for (var p in obj) {
                    if (obj.hasOwnProperty(p) && p) {
                        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
                    }
                }
                return str.join('&');
            },
        };
    });