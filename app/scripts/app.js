'use strict';
/**
 * @ngdoc overview
 * @name chocoholicsApp
 * @description
 * # chocoholicsApp
 *
 * Main module of the application.
 */
angular
    .module('chocoholicsApp', [
        'ngAnimate',
        'ngAria',
        'ngCookies',
        'ngMessages',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ui.router',
        'ui.bootstrap',
        'infinite-scroll',
        'config',
        'LocalStorageModule',
        'ngToast'
    ])
    .config(function($stateProvider, $urlRouterProvider, localStorageServiceProvider) {
        var mainState = {
            name: 'main',
            url: '/main',
            templateUrl: '/views/main.html',
            controller: 'MainCtrl',
            controllerAs: 'main'
        };
        var homeState = {
            name: 'main.home',
            url: '/home',
            templateUrl: '/views/home.html'
        };
        var shopState = {
            name: 'main.shop',
            url: '/shop',
            templateUrl: '/views/shop.html',
            controller: 'ShopCtrl',
            controllerAs: 'shop'
        };
        var productState = {
            name: 'main.product',
            url: '/main/product/:id',
            controller: 'ProductCtrl',
            controllerAs: 'product',
            templateUrl: '/views/product.html'
        };
        var cartState = {
            name: 'main.cart',
            url: '/cart',
            templateUrl: '/views/cart.html',
            controller: 'CartCtrl',
            controllerAs: 'cart'
        };
        var accountState = {
            name: 'main.account',
            url: '/account',
            templateUrl: '/views/account.html',
            controller: 'AccountCtrl',
            controllerAs: 'account'
        };
        $stateProvider.state(mainState);
        $stateProvider.state(homeState);
        $stateProvider.state(shopState);
        $stateProvider.state(cartState);
        $stateProvider.state(productState);
        $stateProvider.state(accountState);
        $urlRouterProvider.otherwise('main/home');
        $urlRouterProvider.when('main/shop');
        localStorageServiceProvider.setStorageType('localStorage');
        
    })
    .run(function($http , localStorageService){
        var token = localStorageService.get('token');
        if (token) {
            $http.defaults.headers.common['x-access-token'] = token;
            $http.defaults.headers.post['x-access-token'] = token;
            $http.defaults.headers.put['x-access-token'] = token;
        }
    })
;