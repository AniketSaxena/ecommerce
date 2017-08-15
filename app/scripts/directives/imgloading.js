'use strict';

/**
 * @ngdoc directive
 * @name chocoholicsApp.directive:imgLoading
 * @description
 * # imgLoading
 */
angular.module('chocoholicsApp')
  .directive('imgLoading', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        return attrs.$observe('afklLazyImageLoaded', function(value) {
          if (window.console) {
            window.console.log('IMAGE LOADED:', value);
            if (value === 'done') {
              element.find('.loading-image').addClass('ng-hide');
              element.find('.afkl-lazy-image').addClass('animated fadeInBig');
            }
          }
        });
      }
    };
  });
