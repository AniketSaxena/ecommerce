'use strict';
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
        'ngToast',
        'ngAside',
        'afkl.lazyImage'
    ])
    .config(function($stateProvider, $urlRouterProvider, localStorageServiceProvider, $locationProvider, ENV) {
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
            templateUrl: '/views/home.html',
            controller: 'HomeCtrl',
            controllerAs: 'home'
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
            url: '/account?back',
            templateUrl: '/views/account.html',
            controller: 'AccountCtrl',
            controllerAs: 'account'
        };
        var passwordChangeState = {
            name: 'passwordChange',
            url: '/passwordChange',
            templateUrl: '/views/passwordChange.html',
            controller: 'PasswordchangeCtrl',
            controllerAs: 'passwordChange'
        };
        var confirmState = {
            name: 'main.confirm',
            url: '/confirm',
            templateUrl: '/views/confirm.html',
            controller: 'ConfirmCtrl',
            controllerAs: 'confirm'
        };
        $stateProvider.state(mainState);
        $stateProvider.state(homeState);
        $stateProvider.state(shopState);
        $stateProvider.state(cartState);
        $stateProvider.state(productState);
        $stateProvider.state(accountState);
        $stateProvider.state(passwordChangeState);
        $stateProvider.state(confirmState);
        $urlRouterProvider.otherwise('main/home');
        localStorageServiceProvider.setStorageType('localStorage');

        if (window.history && window.history.pushState && ENV.build === 'production') {
            $locationProvider.html5Mode(true);
        }


    })
    .run(function($http, localStorageService, ENV) {
        Parse.initialize(ENV.parseAPIKey, ENV.parseJsKey);
        Parse.serverURL = ENV.serverURL + ENV.parsePath;
        var token = localStorageService.get('token');
        if (token) {
            // $http.defaults.headers.common['x-access-token'] = token;
            $http.defaults.headers.post['x-access-token'] = token;
            $http.defaults.headers.put['x-access-token'] = token;
        }
    });