'use strict';
/**
 * @ngdoc service
 * @name chocoholicsApp.orderServices
 * @description
 * # orderServices
 * Factory in the chocoholicsApp.
 */
angular.module('chocoholicsApp')
    .factory('orderService', function($q, $http, ENV) {
        // Service logic
        // ...
        const ENDPOINT = '/order/';
        var vendor = ENV.vendorKey;
        // Public API here
        return {

            // createOrder: function() {
            //     var order = [];
            //     var body = {
            //         mode: ENV.mode,
            //         style: ENV.style,
            //         type: ENV.type,
            //         owner: ENV.owner
            //     };
            //     console.log('creating online order');
            //     return $http.post(ENV.serverURL + ENDPOINT + 'order/' + vendor, body);
            // },
            addOrderItem: function(items) {
                return $http.post(ENV.serverURL + ENDPOINT + 'add', { items: items });
            },
            linkOrder: function(orderId, itemId) {
                return $http.post(ENV.serverURL + ENDPOINT + 'linkOrder', {
                    orderId: orderId,
                    orderItemId: itemId
                });
            },
            removeOrderItem: function(itemId) {
                return $http.delete(ENV.serverURL + ENDPOINT + 'item/' + itemId); /*** need help ***/
            },
            // updateOrderItems: function(itemId, quantity, discount, discountCode, remarks, orderId) {
            //     var body = {
            //         quantity: parseInt(quantity),
            //         discount: parseFloat(discount),
            //         discountCode: discountCode,
            //         remarks: remarks,
            //         orderId: orderId
            //     };
            //     return $http.put(ENV.serverURL + ENDPOINT + 'item/' + itemId, body);
            // },
            // generateLink: function(data) {
            //     /*** What is payPath ***/
            //     return $http.post(ENV.serverURL + ENV.payPath + '/generate', data);
            // },
            // getOrders: function(skip , limit, state, user, complete) {
            //     var orders = [];
            //     if(skip){
            //         queryParams.skip = parseInt(skip);
            //     }
            //     if (limit) {
            //         queryParams.limit = parseInt(limit);
            //     }
            //     if (state) {
            //         queryParams.state = state;
            //     }
            //     if (user) {
            //         queryParams.user = user;
            //     }
            //     if (complete) {
            //         console.log(complete);
            //         queryParams.complete = complete;
            //     }
            // }
        };
    });