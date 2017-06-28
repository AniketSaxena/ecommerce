'use strict';
angular.module('chocoholicsApp')
  .service('accountService', function (ENV, $http) {
  	const ENDPOINT = "/account/";
  	return{
  		getTaxes: function(){
  			return $http.get(ENV.serverURL + ENDPOINT + 'taxes/' + ENV.vendorKey + '?user=' + ENV.owner);
  		}
  	};
  });
