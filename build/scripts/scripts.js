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
        'ngToast'
    ])
    .config(["$stateProvider", "$urlRouterProvider", "localStorageServiceProvider", function($stateProvider, $urlRouterProvider, localStorageServiceProvider) {
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
            url: '/account',
            templateUrl: '/views/account.html',
            controller: 'AccountCtrl',
            controllerAs: 'account'
        };
        var passwordChangeState = {
            name: 'main.passwordChange',
            url: '/main/passwordChange',
            templateUrl: '/views/passwordChange.html',
            controller: 'PasswordchangeCtrl',
            controllerAs: 'passwordChange'
        };
        var confirmState = {
            name: 'main.confirm',
            url: '/main/confirm',
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
        $urlRouterProvider.when('main/shop');
        localStorageServiceProvider.setStorageType('localStorage');
    }])
    .run(["$http", "localStorageService", "ENV", function($http, localStorageService, ENV) {
        Parse.initialize(ENV.parseAPIKey, ENV.parseJsKey);
        Parse.serverURL = ENV.serverURL + ENV.parsePath;
        var token = localStorageService.get('token');
        if (token) {
            $http.defaults.headers.common['x-access-token'] = token;
            $http.defaults.headers.post['x-access-token'] = token;
            $http.defaults.headers.put['x-access-token'] = token;
        }
    }]);
'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
    .controller('MainCtrl', ["$state", "$scope", "$uibModal", "localStorageService", function($state, $scope, $uibModal, localStorageService) {
        //Variables
        var id;
        var vm = this;
        var items;
        var total;
        var checker;
        this.checker = true;
        this.tatal = 0;
        //Variable Definition
        items = localStorageService.get('quantity');
        //Listening for log In
        $scope.$on('login', function(event) {
            vm.open();
        });
        //Listening for getting total items
        $scope.$on('totalQuantity',function(totalQuantity){
            console.log(totalQuantity.targetScope.totalQuantity);
            vm.total = totalQuantity.targetScope.totalQuantity;
        });

        //Function for opening login modal
        this.open = function() {
            var modalInstance = $uibModal.open({
                templateUrl: '/views/loginmodal.html',
                size: 'sm',
                controller: 'LoginmodalCtrl',
                controllerAs: 'login'
            }).result.then(function() {
                vm.checkLoggedIn();
            }).catch(function() {});
        };
        //Function for logging out
        this.logout = function() {
            //This function removes the following items from local storage
            localStorageService.remove('name');
            localStorageService.remove('phone');
            localStorageService.remove('email');
            localStorageService.remove('userId');
            localStorageService.remove('id');
    
            vm.isLoggedIn = false;
            $state.go('main.home');
        };

        // Run this functin to check if the user is already logged in
        this.checkLoggedIn = function() {
            if (localStorageService.get('name')) {
                vm.isLoggedIn = true;
                vm.customerName = localStorageService.get('name');
                vm.customerEmail = localStorageService.get('email');
            } else {

            }
        };
        this.checkLoggedIn();
    }]);
'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:ShopCtrl
 * @description
 * # ShopCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
    .controller('ShopCtrl', ["$scope", "$rootScope", "productService", "orderService", "localStorageService", function($scope, $rootScope, productService, orderService, localStorageService) {
        //variables
        var vm = this;
        var items = [];
        var orderItemId;
        var orderId;
        var total;
        var totalQuantity;
        var quantityObj = {};
        var name;
        var loggedIn;
        this.name = localStorageService.get('name');
        // To check if user logged in
        if (this.name) {
            vm.loggedIn = true;
        } else {
            vm.loggedIn = false;
        }
        this.counter = 0;
        this.busy = false;
        vm.products = [];
        $scope.totalQuantity = 0;
        // this.products = [{ "id": "854MIaWZs8", "name": "shanghai", "subtitle": null, "description": null, "order": 181, "rate": 245, "category": "curries", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-06-03T03:26:30.360Z", "tax": 0, "words": ["chicken", "shanghai", "curries", "sha", "cur"] }, { "id": "yLWYsL3yjX", "name": "triple schezwan fried rice", "subtitle": "Vegetable", "description": null, "order": 120, "rate": 180, "category": "rice", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-06-03T03:26:30.270Z", "tax": 0, "words": ["rice", "triple", "schezwan", "fried", "vegetable", "tri", "sch", "fri", "ric"] }, { "id": "vHf424EuUW", "name": "hunan chicken", "subtitle": null, "description": null, "order": 185, "rate": 245, "category": "curries", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-06-03T03:26:10.607Z", "tax": 0, "words": ["chicken", "hunan", "curries", "hun", "chi", "cur"] }, { "id": "1iWKC06JRM", "name": "changrezi tandoori chicken half", "subtitle": null, "description": null, "order": 40, "rate": 225, "category": "biryani", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-06-03T03:26:10.367Z", "tax": 0, "words": ["chicken", "changrezi", "tandoori", "half", "kebabs", "cha", "tan", "chi", "hal", "keb", "biryani", "bir"] }, { "id": "3xUmdz2EcM", "name": "wonderkid diary", "subtitle": "Milkshake", "description": null, "order": null, "rate": 500, "category": "drinks", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-06-02T14:31:58.506Z", "tax": 0, "words": ["wonderkid", "diary", "drinks", "won", "dia", "dri"] }, { "id": "SUCw5HdZ7W", "name": "shanghai", "subtitle": null, "description": null, "order": 182, "rate": 225, "category": "biryani", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-06-02T14:31:58.225Z", "tax": 0, "words": ["shanghai", "vegetable", "curries", "sha", "cur", "biryani", "bir"] }, { "id": "0hqIDZoOGA", "name": "chocolate brownie ice cream tub", "subtitle": null, "description": null, "order": 93, "rate": 240, "category": "desserts", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-06-02T12:20:32.549Z", "tax": 0, "words": ["ice", "chocolate", "brownie", "cream", "tub", "desserts", "cho", "bro", "cre", "des"] }, { "id": "MIJRFU1H7O", "name": "tandoori chicken half", "subtitle": null, "description": null, "order": 38, "rate": 205, "category": "kebabs", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-06-02T12:20:28.122Z", "tax": 0, "words": ["chicken", "tandoori", "half", "kebabs", "tan", "chi", "hal", "keb"] }, { "id": "2tf9jEtvVn", "name": "pahadi paneer tikka", "subtitle": null, "description": null, "order": 48, "rate": 225, "category": "kebabs", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-06-01T09:27:27.488Z", "tax": 0, "words": ["paneer", "pahadi", "tikka", "kebabs", "pah", "pan", "tik", "keb"] }, { "id": "0RaitneW1p", "name": "dal makhani", "subtitle": null, "description": null, "order": 86, "rate": 195, "category": "daal", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-05-31T16:42:56.494Z", "tax": 0, "words": ["dal", "makhani", "daal", "mak", "daa"] }, { "id": "0MGJKjlICC", "name": "chang’s chilly garlic noodles", "subtitle": "Egg", "description": null, "order": 132, "rate": 150, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-05-31T05:43:40.721Z", "tax": 0, "words": ["noodles", "chang’s", "chilly", "garlic", "egg", "cha", "chi", "gar", "noo"] }, { "id": "shTIxYT4mK", "name": "shanghai", "subtitle": "Paneer", "description": null, "order": 183, "rate": 245, "category": "curries", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-05-31T05:10:44.370Z", "tax": 0, "words": ["shanghai", "paneer", "curries", "sha", "cur"] }, { "id": "VJxfcG4KxJ", "name": "sapo", "subtitle": null, "description": null, "order": 186, "rate": 245, "category": "curries", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-05-31T05:10:44.300Z", "tax": 34.3, "words": ["chicken", "sapo", "curries", "sap", "cur"] }, { "id": "DxEt1ZxgVi", "name": "manchurian noodles", "subtitle": "Chicken", "description": null, "order": 161, "rate": 180, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-05-30T06:41:26.451Z", "tax": 0, "words": ["noodles", "manchurian", "chicken", "man", "noo"] }, { "id": "x3mKSmJFZD", "name": "old school manchurian", "subtitle": null, "description": null, "order": 180, "rate": 225, "category": "curries", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-05-30T06:41:09.491Z", "tax": 0, "words": ["vegetable", "old", "school", "manchurian", "curries", "sch", "man", "cur"] }, { "id": "W6NRzAYPw4", "name": "plain naan", "subtitle": null, "description": null, "order": 79, "rate": 45, "category": "roti", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-05-30T06:41:09.456Z", "tax": 0, "words": ["naan", "plain", "roti", "pla", "naa", "rot"] }, { "id": "O5Y58XPsdy", "name": "roomali roti", "subtitle": null, "description": null, "order": 81, "rate": 30, "category": "roti", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-05-30T06:41:09.421Z", "tax": 0, "words": ["roti", "roomali", "roo", "rot"] }, { "id": "sdJvBZxmZS", "name": "kalmi kebabs", "subtitle": null, "description": null, "order": 42, "rate": 225, "category": "kebabs", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-05-30T06:41:09.382Z", "tax": 0, "words": ["kebab", "kalmi", "kebabs", "kal", "keb"] }, { "id": "uAOigEq1dH", "name": "chicken tikka", "subtitle": null, "description": null, "order": 37, "rate": 200, "category": "kebabs", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-05-30T06:41:08.858Z", "tax": 0, "words": ["chicken", "tikka", "kebabs", "chi", "tik", "keb"] }, { "id": "ayR3B33tpo", "name": "coriander chicken", "subtitle": null, "description": null, "order": 184, "rate": 245, "category": "curries", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-05-30T06:40:48.471Z", "tax": 0, "words": ["chicken", "coriander", "curries", "cor", "chi", "cur"] }, { "id": "o7kQYoVvBI", "name": "sapo", "active": true, "subtitle": null, "description": null, "order": 187, "rate": 255, "category": "biryani", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-05-30T06:40:48.319Z", "tax": 0, "words": ["chicken", "sapo", "paneer", "curries", "sap", "cur", "biryani", "bir"] }, { "id": "31uxDvogds", "name": "amritsari kulcha", "subtitle": null, "description": null, "order": 84, "rate": 65, "category": "roti", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-05-30T06:40:48.209Z", "tax": 0, "words": ["paratha", "amritsari", "kulcha", "roti", "amr", "kul", "rot"] }, { "id": "2h3Q6rpSQg", "name": "teriyaki noodles", "subtitle": "Chicken", "description": null, "order": 157, "rate": 180, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-05-30T06:36:41.578Z", "tax": 0, "words": ["noodles", "teriyaki", "chicken", "ter", "noo"] }, { "id": "2rE05BeOsz", "name": "pot noodles", "subtitle": "Egg", "description": null, "order": 176, "rate": 160, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-05-30T06:36:40.322Z", "tax": 0, "words": ["pot", "noodles", "egg", "noo"] }, { "id": "CgkBb5ML44", "name": "rajwadi kulfi tub", "subtitle": null, "description": null, "order": 96, "rate": 220, "category": "desserts", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-05-30T06:36:39.159Z", "tax": 0, "words": ["rice", "rajwadi", "kulfi", "tub", "desserts", "raj", "kul", "des"] }, { "id": "DqUGegqjNg", "name": "haaka noodles", "subtitle": "Prawns", "description": null, "order": 126, "rate": 160, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-05-30T06:36:38.642Z", "tax": 0, "words": ["noodles", "haaka", "prawns", "haa", "noo"] }, { "id": "D6eH38qFe3", "name": "chang’s chilly garlic noodles", "subtitle": "Chicken", "description": null, "order": 133, "rate": 170, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-05-30T06:36:38.335Z", "tax": 0, "words": ["noodles", "chang’s", "chilly", "garlic", "chicken", "cha", "chi", "gar", "noo"] }, { "id": "DoVORdpDfJ", "name": "haaka noodles", "subtitle": "Chicken", "description": null, "order": 125, "rate": 140, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-05-30T06:36:38.083Z", "tax": 0, "words": ["noodles", "haaka", "chicken", "haa", "noo"] }, { "id": "AQNDoPizjw", "name": "chilly paneer tikka", "subtitle": null, "description": null, "order": 50, "rate": 235, "category": "kebabs", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-05-30T06:36:37.749Z", "tax": 0, "words": ["paneer", "chilly", "tikka", "kebabs", "chi", "pan", "tik", "keb"] }, { "id": "D2tEHPCxQ4", "name": "ping da murgh kebab", "subtitle": null, "description": null, "order": 44, "rate": 225, "category": "kebabs", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-05-30T06:36:37.657Z", "tax": 0, "words": ["chicken", "ping", "da", "murgh", "kebab", "kebabs", "pin", "mur", "keb"] }, { "id": "D32nxDcE1U", "name": "burnt chilly garlic fried rice", "subtitle": "Prawns", "description": null, "order": 108, "rate": 160, "category": "rice", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-05-30T06:36:37.446Z", "tax": 0, "words": ["rice", "burnt", "chilly", "garlic", "fried", "prawns", "bur", "chi", "gar", "fri", "ric"] }, { "id": "DtoUcDHWYB", "name": "butter naan", "subtitle": null, "description": null, "order": 78, "rate": 35, "category": "roti", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-05-30T06:36:36.859Z", "tax": 0, "words": ["naan", "butter", "roti", "but", "naa", "rot"] }, { "id": "BOcH4JytXi", "name": "kung pao pan fried noodles", "subtitle": "Vegetable", "description": null, "order": 171, "rate": 150, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-05-30T06:36:36.624Z", "tax": 0, "words": ["noodles", "kung", "pao", "pan", "fried", "vegetable", "kun", "fri", "noo"] }, { "id": "7iFUAwrowc", "name": "pot rice (thai)", "subtitle": "Prawns", "description": null, "order": 115, "rate": 180, "category": "rice", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-05-28T12:47:59.582Z", "tax": 0, "words": ["rice", "pot", "(thai)", "prawns", "ric", "(th"] }, { "id": "FWvC89e4AL", "name": "pot rice (mongolian)", "subtitle": "Vegetable", "description": null, "order": 116, "rate": 140, "category": "rice", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-05-28T12:47:59.576Z", "tax": 0, "words": ["rice", "pot", "(mongolian)", "vegetable", "ric", "(mo"] }, { "id": "pE23UQaP5B", "name": "pot rice (thai)", "subtitle": "Chicken", "description": null, "order": 114, "rate": 160, "category": "rice", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-05-28T12:47:59.483Z", "tax": 0, "words": ["rice", "pot", "(thai)", "chicken", "ric", "(th"] }, { "id": "xcZGZIGzUg", "name": "tandoori chicken full", "subtitle": null, "description": null, "order": 39, "rate": 325, "category": "kebabs", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-11T14:23:02.937Z", "tax": 0, "words": ["chicken", "tandoori", "full", "kebabs", "tan", "chi", "ful", "keb"] }, { "id": "sAGMm3EmYG", "name": "laccha paratha", "subtitle": null, "description": null, "order": 83, "rate": 45, "category": "roti", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T12:46:48.469Z", "tax": 0, "words": ["paratha", "laccha", "roti", "lac", "par", "rot"] }, { "id": "VJVijq1L6F", "name": "cheese garlic naan", "subtitle": null, "description": null, "order": 80, "rate": 65, "category": "roti", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T12:46:46.327Z", "tax": 0, "words": ["naan", "cheese", "garlic", "roti", "che", "gar", "naa", "rot"] }, { "id": "34q0AGowbn", "name": "tandoori roti", "subtitle": null, "description": null, "order": 77, "rate": 15, "category": "roti", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T12:46:42.194Z", "tax": 0, "words": ["roti", "tandoori", "tan", "rot"] }, { "id": "utkaoGXFYg", "name": "bombay chatpata naan", "subtitle": null, "description": null, "order": 76, "rate": 65, "category": "roti", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T12:46:40.697Z", "tax": 0, "words": ["naan", "bombay", "chatpata", "roti", "bom", "cha", "naa", "rot"] }, { "id": "ezQTPHi19b", "name": "pot rice (mongolian)", "subtitle": "Chicken", "description": null, "order": 118, "rate": 160, "category": "rice", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T12:46:32.057Z", "tax": 0, "words": ["rice", "pot", "(mongolian)", "chicken", "ric", "(mo"] }, { "id": "gnnY6cH0hv", "name": "pot rice (mongolian)", "subtitle": "Prawns", "description": null, "order": 119, "rate": 180, "category": "rice", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T12:46:30.883Z", "tax": 0, "words": ["rice", "pot", "(mongolian)", "prawns", "ric", "(mo"] }, { "id": "d7glI01IEG", "name": "pot rice (mongolian)", "subtitle": "Egg", "description": null, "order": 117, "rate": 150, "category": "rice", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T12:46:29.779Z", "tax": 0, "words": ["rice", "pot", "(mongolian)", "egg", "ric", "(mo"] }, { "id": "ceJ4GSW4ZA", "name": "pot rice (thai)", "subtitle": "Vegetable", "description": null, "order": 112, "rate": 140, "category": "rice", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T12:46:25.147Z", "tax": 0, "words": ["rice", "pot", "(thai)", "vegetable", "ric", "(th"] }, { "id": "jFDv8ahTH8", "name": "pot rice (thai)", "subtitle": "Egg", "description": null, "order": 113, "rate": 150, "category": "rice", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T12:46:24.070Z", "tax": 0, "words": ["rice", "pot", "(thai)", "egg", "ric", "(th"] }, { "id": "5qxNjbFljM", "name": "triple schezwan fried rice", "subtitle": "Egg", "description": null, "order": 121, "rate": 200, "category": "rice", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T12:46:22.996Z", "tax": 0, "words": ["rice", "triple", "schezwan", "fried", "egg", "tri", "sch", "fri", "ric"] }, { "id": "pDuNeF48vk", "name": "triple schezwan fried rice", "subtitle": "Chicken", "description": null, "order": 122, "rate": 220, "category": "rice", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T12:46:11.633Z", "tax": 0, "words": ["rice", "triple", "schezwan", "fried", "chicken", "tri", "sch", "fri", "ric"] }, { "id": "GFas1TGfDq", "name": "bombay manchurian rice", "subtitle": "Chicken", "description": null, "order": 110, "rate": 160, "category": "rice", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T12:45:11.986Z", "tax": 0, "words": ["rice", "bombay", "manchurian", "chicken", "bom", "man", "ric"] }, { "id": "bkrmz9RAT8", "name": "bombay manchurian rice", "subtitle": "Prawns", "description": null, "order": 111, "rate": 180, "category": "rice", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T12:45:09.176Z", "tax": 0, "words": ["rice", "bombay", "manchurian", "prawns", "bom", "man", "ric"] }, { "id": "ijKxXMfIeW", "name": "bombay manchurian rice", "subtitle": "Vegetable", "description": null, "order": 109, "rate": 140, "category": "rice", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T12:45:08.140Z", "tax": 0, "words": ["rice", "bombay", "manchurian", "vegetable", "bom", "man", "ric"] }, { "id": "rUCF7iaY3C", "name": "burnt chilly garlic fried rice", "subtitle": "Chicken", "description": null, "order": 107, "rate": 140, "category": "rice", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T12:45:07.055Z", "tax": 0, "words": ["rice", "burnt", "chilly", "garlic", "fried", "chicken", "bur", "chi", "gar", "fri", "ric"] }, { "id": "8dhrRiUims", "name": "burnt chilly garlic fried rice", "subtitle": "Egg", "description": null, "order": 106, "rate": 130, "category": "rice", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T12:45:04.789Z", "tax": 0, "words": ["rice", "burnt", "chilly", "garlic", "fried", "egg", "bur", "chi", "gar", "fri", "ric"] }, { "id": "oXKhIWYUY6", "name": "schezwan fried rice", "subtitle": "Prawns", "description": null, "order": 104, "rate": 160, "category": "rice", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T12:45:03.693Z", "tax": 0, "words": ["rice", "schezwan", "fried", "prawns", "sch", "fri", "ric"] }, { "id": "izY9r0DmGs", "name": "burnt chilly garlic fried rice", "subtitle": "Vegetable", "description": null, "order": 105, "rate": 120, "category": "rice", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T12:45:02.674Z", "tax": 0, "words": ["rice", "burnt", "chilly", "garlic", "fried", "vegetable", "bur", "chi", "gar", "fri", "ric"] }, { "id": "p3tvKYfl82", "name": "schezwan fried rice", "subtitle": "Chicken", "description": null, "order": 103, "rate": 150, "category": "rice", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T12:45:01.672Z", "tax": 0, "words": ["rice", "schezwan", "fried", "chicken", "sch", "fri", "ric"] }, { "id": "476x4N7qk0", "name": "schezwan fried rice", "subtitle": "Vegetable", "description": null, "order": 101, "rate": 130, "category": "rice", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T12:45:00.606Z", "tax": 0, "words": ["rice", "schezwan", "fried", "vegetable", "sch", "fri", "ric"] }, { "id": "Hp5G1UxbAC", "name": "schezwan fried rice", "subtitle": "Egg", "description": null, "order": 102, "rate": 140, "category": "rice", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T12:44:59.405Z", "tax": 0, "words": ["rice", "schezwan", "fried", "egg", "sch", "fri", "ric"] }, { "id": "oHpE5SZFJE", "name": "fried rice", "subtitle": "Prawns", "description": null, "order": 100, "rate": 160, "category": "rice", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T12:44:58.402Z", "tax": 0, "words": ["rice", "fried", "prawns", "fri", "ric"] }, { "id": "NLDR8J9JOD", "name": "fried rice", "subtitle": "Chicken", "description": null, "order": 99, "rate": 140, "category": "rice", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T12:44:57.001Z", "tax": 0, "words": ["rice", "fried", "chicken", "fri", "ric"] }, { "id": "iRFnvVx28v", "name": "fried rice", "subtitle": "Egg", "description": null, "order": 98, "rate": 130, "category": "rice", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T12:44:54.851Z", "tax": 0, "words": ["rice", "fried", "egg", "fri", "ric"] }, { "id": "8HcTUxvJCa", "name": "fried rice", "subtitle": "Vegetable", "description": null, "order": 97, "rate": 120, "category": "rice", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T12:44:48.524Z", "tax": 0, "words": ["rice", "fried", "vegetable", "fri", "ric"] }, { "id": "WVAvNGQ7xq", "name": "baida roti chicken", "subtitle": null, "description": null, "order": 51, "rate": 195, "category": "kebabs", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T12:36:35.739Z", "tax": 0, "words": ["murgh", "baida", "roti", "chicken", "kebabs", "bai", "rot", "chi", "keb"] }, { "id": "JMVEjfsqbg", "name": "paneer tikka", "subtitle": null, "description": null, "order": 49, "rate": 225, "category": "kebabs", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T12:36:28.285Z", "tax": 0, "words": ["tikka", "paneer", "kebabs", "pan", "tik", "keb"] }, { "id": "ygCLrIBgcC", "name": "chanrezi lollypop", "subtitle": null, "description": null, "order": 47, "rate": 225, "category": "kebabs", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T12:36:27.244Z", "tax": 0, "words": ["lollypop", "chanrezi", "kebabs", "cha", "lol", "keb"] }, { "id": "ZMKwMzglqQ", "name": "so bo chicken kebab", "subtitle": null, "description": null, "order": 46, "rate": 225, "category": "kebabs", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T12:36:26.096Z", "tax": 0, "words": ["chicken", "so", "bo", "kebab", "kebabs", "chi", "keb"] }, { "id": "JsBQOUDHH7", "name": "chow tao tikka", "subtitle": null, "description": null, "order": 45, "rate": 225, "category": "kebabs", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T12:36:23.910Z", "tax": 0, "words": ["chicken", "chow", "tao", "tikka", "kebabs", "cho", "tik", "keb"] }, { "id": "kjSyKx1qs3", "name": "murgh malai tikka", "subtitle": null, "description": null, "order": 43, "rate": 225, "category": "kebabs", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T12:36:22.895Z", "tax": 0, "words": ["chicken", "murgh", "malai", "tikka", "kebabs", "mur", "mal", "tik", "keb"] }, { "id": "f12gJSJEdT", "name": "changrezi tandoori chicken full", "subtitle": null, "description": null, "order": 41, "rate": 345, "category": "kebabs", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T12:36:21.903Z", "tax": 0, "words": ["chicken", "changrezi", "tandoori", "full", "kebabs", "cha", "tan", "chi", "ful", "keb"] }, { "id": "VGMrQOubTj", "name": "mutton rogan tikka", "subtitle": null, "description": null, "order": 54, "rate": 245, "category": "kebabs", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T12:36:13.964Z", "tax": 0, "words": ["tikka", "mutton", "rogan", "kebabs", "mut", "rog", "tik", "keb"] }, { "id": "VLhpizC7zB", "name": "baida roti mutton", "subtitle": null, "description": null, "order": 52, "rate": 225, "category": "kebabs", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T12:36:11.499Z", "tax": 0, "words": ["mutton", "baida", "roti", "kebabs", "bai", "rot", "mut", "keb"] }, { "id": "w5jPaAqtwc", "name": "mutton lahori sheekh", "subtitle": null, "description": null, "order": 55, "rate": 245, "category": "kebabs", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T12:36:10.407Z", "tax": 0, "words": ["kebab", "mutton", "lahori", "sheekh", "kebabs", "mut", "lah", "she", "keb"] }, { "id": "k8AUEviiZL", "name": "naughty para bhara kebabs", "subtitle": null, "description": null, "order": 53, "rate": 195, "category": "kebabs", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T12:36:09.195Z", "tax": 0, "words": ["kebab", "naughty", "para", "bhara", "kebabs", "nau", "par", "bha", "keb"] }, { "id": "7GibWKiTm3", "name": "mutton peshawari kebab", "subtitle": null, "description": null, "order": 56, "rate": 265, "category": "kebabs", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T12:36:06.882Z", "tax": 0, "words": ["kebab", "mutton", "peshawari", "kebabs", "mut", "pes", "keb"] }, { "id": "cqvCcibY6Y", "name": "gulab jamun", "subtitle": null, "description": null, "order": 90, "rate": 45, "category": "desserts", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:54:21.283Z", "tax": 0, "words": ["gulab", "jamun", "desserts", "gul", "jam", "des"] }, { "id": "I9gXnsP05l", "name": "salted caramel phirni", "subtitle": null, "description": null, "order": 89, "rate": 95, "category": "desserts", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:54:19.158Z", "tax": 0, "words": ["phirni", "salted", "caramel", "desserts", "sal", "car", "phi", "des"] }, { "id": "GKUxDN9ptA", "name": "banarsi paan kulfi", "subtitle": null, "description": null, "order": 88, "rate": 55, "category": "desserts", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:54:18.013Z", "tax": 0, "words": ["phirni", "banarsi", "paan", "kulfi", "desserts", "ban", "paa", "kul", "des"] }, { "id": "AE30WGHIV0", "name": "chocolate brownie", "subtitle": null, "description": null, "order": 91, "rate": 65, "category": "desserts", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:54:16.523Z", "tax": 0, "words": ["choco", "chocolate", "brownie", "desserts", "cho", "bro", "des"] }, { "id": "Jo0IGDyFqB", "name": "sugar free vanilla ice cream", "subtitle": null, "description": null, "order": 94, "rate": 40, "category": "desserts", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:54:14.482Z", "tax": 0, "words": ["ice", "sugar", "free", "vanilla", "cream", "desserts", "sug", "fre", "van", "cre", "des"] }, { "id": "meSZC7j5TB", "name": "belgium chocolate ice cream tub", "subtitle": null, "description": null, "order": 92, "rate": 240, "category": "desserts", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:54:07.925Z", "tax": 0, "words": ["ice", "belgium", "chocolate", "cream", "tub", "desserts", "bel", "cho", "cre", "des"] }, { "id": "QidIi1xoAk", "name": "sitafal ice cream tub", "subtitle": null, "description": null, "order": 95, "rate": 220, "category": "desserts", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:54:06.565Z", "tax": 0, "words": ["ice", "sitafal", "cream", "tub", "desserts", "sit", "cre", "des"] }, { "id": "RckZJAWm6G", "name": "dal tadka", "subtitle": null, "description": null, "order": 85, "rate": 145, "category": "daal", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:53:24.718Z", "tax": 0, "words": ["dal", "tadka", "daal", "tad", "daa"] }, { "id": "jeEzKAMEAP", "name": "dal ghosht", "subtitle": null, "description": null, "order": 87, "rate": 225, "category": "daal", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:53:20.000Z", "tax": 0, "words": ["dal", "ghosht", "daal", "gho", "daa"] }, { "id": "b6ODv1MqQn", "name": "delhi butter chicken", "subtitle": null, "description": null, "order": 58, "rate": 245, "category": "curries", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:51:42.015Z", "tax": 0, "words": ["chicken", "delhi", "butter", "curries", "del", "but", "chi", "cur"] }, { "id": "F4xR60zBJB", "name": "punjabi balti chicken", "subtitle": null, "description": null, "order": 59, "rate": 225, "category": "curries", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:51:39.528Z", "tax": 0, "words": ["chicken", "punjabi", "balti", "curries", "pun", "bal", "chi", "cur"] }, { "id": "Tx68IlBANM", "name": "bombay butter chicken", "subtitle": null, "description": null, "order": 57, "rate": 225, "category": "curries", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:51:33.275Z", "tax": 0, "words": ["chicken", "bombay", "butter", "curries", "bom", "but", "chi", "cur"] }, { "id": "N5FxmjGJHj", "name": "mutton kheema", "subtitle": null, "description": null, "order": 62, "rate": 265, "category": "curries", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:51:31.164Z", "tax": 0, "words": ["mutton", "kheema", "curries", "mut", "khe", "cur"] }, { "id": "FdsBdPGoSF", "name": "chicken kheema", "subtitle": null, "description": null, "order": 61, "rate": 225, "category": "curries", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:51:29.994Z", "tax": 0, "words": ["chicken", "kheema", "curries", "chi", "khe", "cur"] }, { "id": "kvhAdgWqnj", "name": "kadhai murgh saag", "subtitle": null, "description": null, "order": 60, "rate": 245, "category": "curries", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:51:28.812Z", "tax": 0, "words": ["chicken", "kadhai", "murgh", "saag", "curries", "kad", "mur", "saa", "cur"] }, { "id": "JdxkvF1eUX", "name": "mutton rogan josh", "subtitle": null, "description": null, "order": 65, "rate": 265, "category": "curries", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:51:26.690Z", "tax": 0, "words": ["mutton", "rogan", "josh", "curries", "mut", "rog", "jos", "cur"] }, { "id": "7AENsxfvLN", "name": "bombay toofani chicken", "subtitle": null, "description": null, "order": 63, "rate": 225, "category": "curries", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:51:25.504Z", "tax": 0, "words": ["chicken", "bombay", "toofani", "curries", "bom", "too", "chi", "cur"] }, { "id": "WbB4zVnn5D", "name": "boti kebab masala", "subtitle": null, "description": null, "order": 68, "rate": 265, "category": "curries", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:51:24.410Z", "tax": 0, "words": ["masala", "boti", "kebab", "curries", "bot", "keb", "mas", "cur"] }, { "id": "pVmpYpQF8S", "name": "dabba ghosht", "subtitle": null, "description": null, "order": 69, "rate": 255, "category": "curries", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:51:23.254Z", "tax": 0, "words": ["mutton", "dabba", "ghosht", "curries", "dab", "gho", "cur"] }, { "id": "NYHJFk2XHZ", "name": "mutton korma", "subtitle": null, "description": null, "order": 66, "rate": 255, "category": "curries", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:51:22.060Z", "tax": 0, "words": ["mutton", "korma", "curries", "mut", "kor", "cur"] }, { "id": "H8QvN9zYsJ", "name": "balle balle cream chicken", "subtitle": null, "description": null, "order": 64, "rate": 265, "category": "curries", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:51:20.903Z", "tax": 0, "words": ["chicken", "balle", "cream", "curries", "bal", "cre", "chi", "cur"] }, { "id": "T7g8UdyUtB", "name": "paneer makhani", "subtitle": null, "description": null, "order": 71, "rate": 225, "category": "curries", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:51:19.796Z", "tax": 0, "words": ["paneer", "makhani", "curries", "pan", "mak", "cur"] }, { "id": "QHRC3Ic3bD", "name": "toofani paneer masala", "subtitle": null, "description": null, "order": 72, "rate": 225, "category": "curries", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:51:18.597Z", "tax": 0, "words": ["paneer", "toofani", "masala", "curries", "too", "pan", "mas", "cur"] }, { "id": "IyUJEXbPvY", "name": "nalli nihari", "subtitle": null, "description": null, "order": 70, "rate": 265, "category": "curries", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:51:17.576Z", "tax": 0, "words": ["mutton", "nalli", "nihari", "curries", "nal", "nih", "cur"] }, { "id": "EXyJ9OuRhg", "name": "lamb chop masala", "subtitle": null, "description": null, "order": 67, "rate": 245, "category": "curries", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:51:16.595Z", "tax": 0, "words": ["masala", "lamb", "chop", "curries", "lam", "cho", "mas", "cur"] }, { "id": "LbFkpo4lOu", "name": "tawa mushroom masala", "subtitle": null, "description": null, "order": 73, "rate": 215, "category": "curries", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:51:15.614Z", "tax": 0, "words": ["mushroom", "tawa", "masala", "curries", "taw", "mus", "mas", "cur"] }, { "id": "F7HOnDKyaR", "name": "chicken curry rice", "subtitle": null, "description": null, "order": 74, "rate": 275, "category": "curries", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:51:13.335Z", "tax": 0, "words": ["rice", "chicken", "curry", "curries", "chi", "cur", "ric"] }, { "id": "ttLszOAlPv", "name": "prawn curry rice", "subtitle": null, "description": null, "order": 75, "rate": 295, "category": "curries", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:51:05.719Z", "tax": 0, "words": ["rice", "prawn", "curry", "curries", "pra", "cur", "ric"] }, { "id": "LQTzWrfq4M", "name": "old school manchurian", "subtitle": "Chicken", "description": null, "order": 179, "rate": 240, "category": "curries", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:51:02.934Z", "tax": 0, "words": ["old", "school", "manchurian", "chicken", "curries", "sch", "man", "cur"] }, { "id": "PqfHh60Xms", "name": "singapore noodles", "subtitle": "Egg", "description": null, "order": 144, "rate": 150, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:48:55.336Z", "tax": 0, "words": ["noodles", "singapore", "egg", "sin", "noo"] }, { "id": "GqX9HLnkPe", "name": "singapore noodles", "subtitle": "Chicken", "description": null, "order": 145, "rate": 170, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:48:53.985Z", "tax": 0, "words": ["noodles", "singapore", "chicken", "sin", "noo"] }, { "id": "4TOUi3vDVv", "name": "bangkok street noodles", "subtitle": "Vegetable", "description": null, "order": 147, "rate": 140, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:48:52.975Z", "tax": 0, "words": ["noodles", "bangkok", "street", "vegetable", "ban", "str", "noo"] }, { "id": "yC2bmnoMeM", "name": "bangkok street noodles", "subtitle": "Egg", "description": null, "order": 148, "rate": 150, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:48:51.918Z", "tax": 0, "words": ["noodles", "bangkok", "street", "egg", "ban", "str", "noo"] }, { "id": "zPrPfJ359T", "name": "singapore noodles", "subtitle": "Prawns", "description": null, "order": 146, "rate": 190, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:48:50.754Z", "tax": 0, "words": ["noodles", "singapore", "prawns", "sin", "noo"] }, { "id": "GK7kNlC40J", "name": "pad thai noodles", "subtitle": "Prawns", "description": null, "order": 142, "rate": 190, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:48:49.581Z", "tax": 0, "words": ["noodles", "pad", "thai", "prawns", "tha", "noo"] }, { "id": "xYDspO9O7P", "name": "singapore noodles", "subtitle": "Vegetable", "description": null, "order": 143, "rate": 140, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:48:48.580Z", "tax": 0, "words": ["noodles", "singapore", "vegetable", "sin", "noo"] }, { "id": "MqpINjLiqg", "name": "haaka noodles", "subtitle": "Vegetable", "description": null, "order": 123, "rate": 120, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:48:47.577Z", "tax": 0, "words": ["noodles", "haaka", "vegetable", "haa", "noo"] }, { "id": "WrY7217FZo", "name": "bangkok street noodles", "subtitle": "Chicken", "description": null, "order": 149, "rate": 170, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:48:31.015Z", "tax": 0, "words": ["noodles", "bangkok", "street", "chicken", "ban", "str", "noo"] }, { "id": "kgnJrUsPDV", "name": "black pepper tossed noodles", "subtitle": "Vegetable", "description": null, "order": 151, "rate": 130, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:48:27.338Z", "tax": 0, "words": ["noodles", "black", "pepper", "tossed", "vegetable", "bla", "pep", "tos", "noo"] }, { "id": "vQWgoBQyDE", "name": "bangkok street noodles", "subtitle": "Prawns", "description": null, "order": 150, "rate": 190, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:48:24.582Z", "tax": 0, "words": ["noodles", "bangkok", "street", "prawns", "ban", "str", "noo"] }, { "id": "filfRcwgS5", "name": "teriyaki noodles", "subtitle": "Vegetable", "description": null, "order": 155, "rate": 150, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:48:08.699Z", "tax": 0, "words": ["noodles", "teriyaki", "vegetable", "ter", "noo"] }, { "id": "eNARXbhqoP", "name": "black pepper tossed noodles", "subtitle": "Chicken", "description": null, "order": 153, "rate": 150, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:48:07.283Z", "tax": 0, "words": ["noodles", "black", "pepper", "tossed", "chicken", "bla", "pep", "tos", "noo"] }, { "id": "p2EMuZUU0U", "name": "black pepper tossed noodles", "subtitle": "Egg", "description": null, "order": 152, "rate": 140, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:48:04.964Z", "tax": 0, "words": ["noodles", "black", "pepper", "tossed", "egg", "bla", "pep", "tos", "noo"] }, { "id": "eCMN8Jv0Nk", "name": "black pepper tossed noodles", "subtitle": "Prawns", "description": null, "order": 154, "rate": 170, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:48:02.750Z", "tax": 0, "words": ["noodles", "black", "pepper", "tossed", "prawns", "bla", "pep", "tos", "noo"] }, { "id": "pNGI0D1nvA", "name": "teriyaki noodles", "subtitle": "Egg", "description": null, "order": 156, "rate": 160, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:47:47.820Z", "tax": 0, "words": ["noodles", "teriyaki", "egg", "ter", "noo"] }, { "id": "Oq5yYaKTPq", "name": "manchurian noodles", "subtitle": "Vegetable", "description": null, "order": 159, "rate": 150, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:47:43.870Z", "tax": 0, "words": ["noodles", "manchurian", "vegetable", "man", "noo"] }, { "id": "gTEHPAhAEx", "name": "teriyaki noodles", "subtitle": "Prawns", "description": null, "order": 158, "rate": 200, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:47:41.744Z", "tax": 0, "words": ["noodles", "teriyaki", "prawns", "ter", "noo"] }, { "id": "wdQthVJSP5", "name": "manchurian noodles", "subtitle": "Egg", "description": null, "order": 160, "rate": 160, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:47:37.931Z", "tax": 0, "words": ["noodles", "manchurian", "egg", "man", "noo"] }, { "id": "g1MXtvm4X7", "name": "mongolian noodles", "subtitle": "Vegetable", "description": null, "order": 163, "rate": 150, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:47:36.457Z", "tax": 0, "words": ["noodles", "mongolian", "vegetable", "mon", "noo"] }, { "id": "JZoZDA1gNj", "name": "manchurian noodles", "subtitle": "Prawns", "description": null, "order": 162, "rate": 200, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:47:35.347Z", "tax": 0, "words": ["noodles", "manchurian", "prawns", "man", "noo"] }, { "id": "Z0Nqu0o0Kk", "name": "hunan pan fried noodles", "subtitle": "Vegetable", "description": null, "order": 167, "rate": 150, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:47:34.142Z", "tax": 0, "words": ["noodles", "hunan", "pan", "fried", "vegetable", "hun", "fri", "noo"] }, { "id": "L3lY426arC", "name": "mongolian noodles", "subtitle": "Chicken", "description": null, "order": 165, "rate": 180, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:47:33.036Z", "tax": 0, "words": ["noodles", "mongolian", "chicken", "mon", "noo"] }, { "id": "jGEN8zhDeG", "name": "mongolian noodles", "subtitle": "Egg", "description": null, "order": 164, "rate": 160, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:47:31.896Z", "tax": 0, "words": ["noodles", "mongolian", "egg", "mon", "noo"] }, { "id": "hsSPvJtfT4", "name": "mongolian noodles", "subtitle": "Prawns", "description": null, "order": 166, "rate": 200, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:47:30.882Z", "tax": 0, "words": ["noodles", "mongolian", "prawns", "mon", "noo"] }, { "id": "jC3xZHfq6s", "name": "hunan pan fried noodles", "subtitle": "Egg", "description": null, "order": 168, "rate": 160, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:47:28.454Z", "tax": 0, "words": ["noodles", "hunan", "pan", "fried", "egg", "hun", "fri", "noo"] }, { "id": "2HpOuYc8nn", "name": "hunan pan fried noodles", "subtitle": "Prawns", "description": null, "order": 170, "rate": 200, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:47:17.734Z", "tax": 0, "words": ["noodles", "hunan", "pan", "fried", "prawns", "hun", "fri", "noo"] }, { "id": "iqCQYKlola", "name": "kung pao pan fried noodles", "subtitle": "Prawns", "description": null, "order": 174, "rate": 200, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:47:14.067Z", "tax": 0, "words": ["noodles", "kung", "pao", "pan", "fried", "prawns", "kun", "fri", "noo"] }, { "id": "4GBh7jfM87", "name": "kung pao pan fried noodles", "subtitle": "Chicken", "description": null, "order": 173, "rate": 180, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:47:11.924Z", "tax": 0, "words": ["noodles", "kung", "pao", "pan", "fried", "chicken", "kun", "fri", "noo"] }, { "id": "TQohw4U6PN", "name": "kung pao pan fried noodles", "subtitle": "Egg", "description": null, "order": 172, "rate": 160, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:47:07.301Z", "tax": 0, "words": ["noodles", "kung", "pao", "pan", "fried", "egg", "kun", "fri", "noo"] }, { "id": "WESDOGaV3r", "name": "hunan pan fried noodles", "subtitle": "Chicken", "description": null, "order": 169, "rate": 180, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:47:06.096Z", "tax": 0, "words": ["noodles", "hunan", "pan", "fried", "chicken", "hun", "fri", "noo"] }, { "id": "iBLZwMJQ31", "name": "pot noodles", "subtitle": "Vegetable", "description": null, "order": 175, "rate": 150, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:47:04.868Z", "tax": 0, "words": ["noodles", "pot", "vegetable", "noo"] }, { "id": "zGTveDOTAv", "name": "pot noodles", "subtitle": "Chicken", "description": null, "order": 177, "rate": 180, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:47:00.684Z", "tax": 0, "words": ["noodles", "pot", "chicken", "noo"] }, { "id": "pPfIzotf0V", "name": "pot noodles", "subtitle": "Prawns", "description": null, "order": 178, "rate": 200, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:46:54.413Z", "tax": 0, "words": ["pot", "noodles", "prawns", "noo"] }, { "id": "6yTfS399cr", "name": "pad thai noodles", "subtitle": "Chicken", "description": null, "order": 141, "rate": 170, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:46:17.607Z", "tax": 0, "words": ["noodles", "pad", "thai", "chicken", "tha", "noo"] }, { "id": "BxEO7JvAem", "name": "pad thai noodles", "subtitle": "Egg", "description": null, "order": 140, "rate": 150, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:46:16.099Z", "tax": 0, "words": ["noodles", "pad", "thai", "egg", "tha", "noo"] }, { "id": "4UaaUGHt1x", "name": "malaysian noodles", "subtitle": "Prawns", "description": null, "order": 138, "rate": 190, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:46:14.758Z", "tax": 0, "words": ["noodles", "malaysian", "prawns", "mal", "noo"] }, { "id": "aB5zbsjQG7", "name": "pad thai noodles", "subtitle": "Vegetable", "description": null, "order": 139, "rate": 140, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:46:13.537Z", "tax": 0, "words": ["noodles", "pad", "thai", "vegetable", "tha", "noo"] }, { "id": "TFTLT7SRTW", "name": "malaysian noodles", "subtitle": "Chicken", "description": null, "order": 137, "rate": 170, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:46:12.425Z", "tax": 0, "words": ["noodles", "malaysian", "chicken", "mal", "noo"] }, { "id": "au47LgYQ8q", "name": "malaysian noodles", "subtitle": "Egg", "description": null, "order": 136, "rate": 140, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:46:11.282Z", "tax": 0, "words": ["noodles", "malaysian", "egg", "mal", "noo"] }, { "id": "mmu7wfaye6", "name": "malaysian noodles", "subtitle": "Vegetable", "description": null, "order": 135, "rate": 130, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:46:09.131Z", "tax": 0, "words": ["noodles", "malaysian", "vegetable", "mal", "noo"] }, { "id": "hHSBEjfpny", "name": "chang’s chilly garlic noodles", "subtitle": "Prawns", "description": null, "order": 134, "rate": 190, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:46:02.819Z", "tax": 0, "words": ["noodles", "chang’s", "chilly", "garlic", "prawns", "cha", "chi", "gar", "noo"] }, { "id": "LGDkuG8CDl", "name": "chang’s chilly garlic noodles", "subtitle": "Vegetable", "description": null, "order": 131, "rate": 140, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:45:59.622Z", "tax": 0, "words": ["noodles", "chang’s", "chilly", "garlic", "vegetable", "cha", "chi", "gar", "noo"] }, { "id": "fOCSDkHwuW", "name": "schezwan noodles", "subtitle": "Prawns", "description": null, "order": 130, "rate": 170, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:45:56.276Z", "tax": 0, "words": ["noodles", "schezwan", "prawns", "sch", "noo"] }, { "id": "EyvWTXjVTt", "name": "schezwan noodles", "subtitle": "Chicken", "description": null, "order": 129, "rate": 150, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:45:55.096Z", "tax": 0, "words": ["noodles", "schezwan", "chicken", "sch", "noo"] }, { "id": "fgoFUqBJ2F", "name": "schezwan noodles", "subtitle": "Egg", "description": null, "order": 128, "rate": 140, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:45:53.859Z", "tax": 0, "words": ["noodles", "schezwan", "egg", "sch", "noo"] }, { "id": "9b2twp5FrC", "name": "schezwan noodles", "subtitle": "Vegetable", "description": null, "order": 127, "rate": 130, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:45:52.037Z", "tax": 0, "words": ["noodles", "schezwan", "vegetable", "sch", "noo"] }, { "id": "9XBapFdgDA", "name": "haaka noodles", "subtitle": "Egg", "description": null, "order": 124, "rate": 130, "category": "noodles", "stats": { "__type": "Relation", "className": "ProductStats" }, "updatedAt": "2017-04-08T11:45:46.884Z", "tax": 0, "words": ["noodles", "haaka", "egg", "haa", "noo"] }];
        orderId = localStorageService.get('id');
        $scope.$watch('totalQuantity', function(newValue,oldValue){
            $scope.$emit('totalQuantity',totalQuantity);
        });
        //Function to loadmore items for infinite scroll
        this.loadMore = function() {
            if (vm.busy) {
                return;
            }
            vm.busy = true;
            productService.getProducts(vm.counter, 12)
                .then(function(response) {
                    // console.log(response.data);
                    angular.forEach(response.data, function(element) {
                        element.quantity = 0;
                        vm.products.push(element);
                        vm.busy = false;
                    });
                    return orderService.getOrderItems(orderId);
                })
                .then(function(response) {
                    _.each(response.data, function(item) {
                        _.each(vm.products, function(product) {
                            if (product.id === item.itemId) {
                                product.quantity = item.quantity;
                                product.addedId = item.id;
                                console.log('itemid'+product.addedId);
                                // FOR IMAGES
                                // vm.loadImages(vm.product.images);
                            }
                        });
                    });

                    // console.log(vm.products);
                })
                .catch(function(error) {
                    console.error(error);
                });
            vm.counter++;
            // console.log('entering page number ' + vm.counter);
        };
        this.addItem = function(index) {
            vm.products[index].adding = true;
            var item = {
                itemId: vm.products[index].id,
                quantity: 1
            };
            items = [];
            items.push(item);
            console.log(vm.products[index]);
            if (vm.products[index].quantity !== 0) {
                vm.products[index].quantity++;
                console.log(vm.products[index].addedId);
                console.log(vm.products[index].quantity);
                console.log(orderId);
                orderService.updateOrderItem(vm.products[index].addedId, vm.products[index].quantity, null, null, null, orderId)
                    .then(function(response) {
                        console.log(response);
                        console.log(vm.products[index].quantity);
                        $scope.totalQuantity = $scope.totalQuantity + 1;
                        localStorageService.set('total', vm.total);
                        vm.products[index].adding = false;
                    }).catch(function(error) {
                        console.log(error);
                        vm.products[index].adding = false;
                    });
            } else {
                orderService.addOrderItem(items)
                    .then(function(response) {
                        // console.log(response.data);
                        vm.products[index].quantity++;
                        orderItemId = response.data;
                        vm.products[index].addedId = orderItemId;
                        return orderService.linkOrder(orderId, orderItemId);
                    })
                    .then(function(response) {
                        console.log(response);
                        $scope.totalQuantity = $scope.totalQuantity + 1;
                        vm.products[index].adding = false;
                        // localStorageService.set('total',vm.total);
                    })
                    .catch(function(error) {
                        console.error(error);
                        vm.products[index].adding = false;
                    });
            }
        };
        this.getItems = function(orderId) {
            $scope.totalQuantity = 0;
            orderService.getOrderItems(orderId)
                .then(function(response) {
                    //console.log(response);
                    _.each(response.data,function(orderItem){
                        $scope.totalQuantity += orderItem.quantity;
                    })
                    $scope.$emit('totalQuantity',totalQuantity);
                }).catch(function(error) {
                    console.log(error);
                });
        };
        //Function to add items when user is logged out
        this.addItemLoggedOut = function(index) {
            vm.products[index].adding = true;
            var item = {
                itemId: vm.products[index].id,
                quantity: 1
            };
            items = [];
            items.push(item);
            console.log(vm.products[index]);
            if (orderId) {
                if (vm.products[index].quantity !== 0) {
                    vm.products[index].quantity++;
                    console.log(vm.products[index].addedId);
                console.log(vm.products[index].quantity);
                console.log(orderId);
                    orderService.updateOrderItem(vm.products[index].addedId, vm.products[index].quantity, null, null, null, orderId)
                        .then(function(response) {
                            console.log(response);
                            vm.products[index].adding = false;
                            console.log(vm.products[index].quantity);
                            $scope.totalQuantity = $scope.totalQuantity + 1;
                            localStorageService.set('total', vm.total);
                        }).catch(function(error) {
                            console.log(error);
                            vm.products[index].adding = false;
                        });
                } else {
                    orderService.addOrderItem(items)
                        .then(function(response) {
                            // console.log(response.data);
                            vm.products[index].quantity++;
                            orderItemId = response.data;
                            return orderService.linkOrder(orderId, orderItemId);
                        })
                        .then(function(response) {
                            console.log(response);
                           $scope.totalQuantity = $scope.totalQuantity + 1;
                            vm.products[index].adding = false;
                            // localStorageService.set('total',vm.total);
                        })
                        .catch(function(error) {
                            console.error(error);
                            vm.products[index].adding = false;
                        });
                }
            } else {
                orderService.createOrder()
                    .then(function(response) {
                        orderId = response.data.objectId;
                        localStorageService.set('id', orderId);
                        return orderService.addOrderItem(items)
                    }).then(function(response) {
                        vm.products[index].quantity++;
                        orderItemId = response.data;
                        return orderService.linkOrder(orderId, orderItemId);
                    })
                    .then(function(response) {
                        console.log(response);
                        $scope.totalQuantity = $scope.totalQuantity + 1;
                        vm.products[index].adding = false;
                        // localStorageService.set('total',vm.total);
                    })
                    .catch(function(error) {
                        console.error(error);
                        vm.products[index].adding = false;
                    });
            }
        };
        //FOR IMAGES
        // this.loadImages = function(images) {
        //        angular.forEach(images, function(image) {
        //                console.log(image.id);
        //                stockService
        //                    .getImages(image.id)
        //                    .then(function(image) {
        //                        console.log(image);
        //                        vm.images.push(image);
        //                    }).catch(function(error) {
        //                        console.log(error);
        //                    });
        //            });
        //    };
        this.getItems(orderId);
    }]);
'use strict';
/**
 * @ngdoc service
 * @name chocoholicsApp.productService
 * @description
 * # productService
 * Factory in the chocoholicsApp.
 */
angular.module('chocoholicsApp')
    .factory('productService', ["$http", "ENV", "$q", function($http, ENV, $q) {
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
    }]);
'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:ProductCtrl
 * @description
 * # ProductCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
    .controller('ProductCtrl', ["$stateParams", "productService", "orderService", function($stateParams, productService, orderService) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        var vm = this;
        this.product = {};
        this.product.smallImage = "https://placeholdit.co//i/400x400?&text=Random";
        this.product.mediumImage = "https://placeholdit.co//i/800x800?&text=Random";
        this.product.largeImage = "https://placeholdit.co//i/1200x1200?&text=Random";
        this.id = $stateParams.id;
        this.loadProduct = function(id) {
            productService.getProduct(id)
                .then(function(responese) {
                    console.log(responese.data.images);
                    vm.product = responese.data;
                    console.log(vm.product);
                    //  FOR IMAGES
                    vm.loadImages(vm.product.images);
                });
        };

        // FOR IMAGES
        this.loadImages = function(images) {
            angular.forEach(images, function(image) {
                console.log(image.id);
                productService
                    .getImages(image.id)
                    .then(function(image) {
                        console.log(image);
                        vm.images.push(image);
                    }, function(error) {
                        vm.$emit('error', { message: error });
                    });
            });
        };

         this.addItem = function() {
            vm.product.adding = true;
            var item = {
                itemId: vm.product.id,
                quantity: 1
            };
            items = [];
            items.push(item);
            console.log(vm.product);
            if (vm.product.quantity !== 0) {
                vm.product.quantity++;
                orderService.updateOrderItem(vm.product.addedId, vm.product.quantity, null, null, null, orderId)
                    .then(function(response) {
                        console.log(response);
                        // vm.product.adding = false;
                        console.log(vm.product.quantity);
                    }).catch(function(error) {
                        console.log(error);
                        // vm.product.adding = false;
                    });
            } else {
                orderService.addOrderItem(items)
                    .then(function(response) {
                        // console.log(response.data);
                        vm.product.quantity++;
                        orderItemId = response.data;
                        return orderService.linkOrder(orderId, orderItemId);
                    })
                    .then(function(response) {
                        console.log(response);
                        vm.product.adding = false;
                    })
                    .catch(function(error) {
                        console.error(error);
                        vm.product.adding = false;
                    });
            }
        };

        this.loadProduct(this.id);
    }]);
'use strict';
/**
 * @ngdoc service
 * @name chocoholicsApp.orderServices
 * @description
 * # orderServices
 * Factory in the chocoholicsApp.
 */
angular.module('chocoholicsApp')
    .factory('orderService', ["$q", "$http", "ENV", "commonService", function($q, $http, ENV, commonService) {
        // Service logic
        // ...
        const ENDPOINT = '/order/';
        var vendor = ENV.vendorKey;
        // Public API here
        return {
            createOrder: function() {
                var body = {
                    mode: ENV.mode,
                    style: ENV.style,
                    type: ENV.type,
                    owner: ENV.owner
                };
                console.log('creating online order');
                return $http.post(ENV.serverURL + ENDPOINT + 'order/' + vendor, body);
            },
            addOrderItem: function(items) {
                return $http.post(ENV.serverURL + ENDPOINT + 'add', { items: items });
            },
            linkOrder: function(orderId, itemId) {
                return $http.post(ENV.serverURL + ENDPOINT + 'linkOrder', {
                    orderId: orderId,
                    orderItemId: itemId
                });
            },
            getOrderItems: function(orderId) {
                return $http.get(ENV.serverURL + ENDPOINT + 'items/' + orderId);
            },
            removeOrderItem: function(id) {
                return $http.delete(ENV.serverURL + ENDPOINT + 'item/' + id); /*** need help ***/
            },
            updateOrderItem: function(itemId, quantity, discount, discountCode, remarks, orderId) {
                var body = {
                    quantity: parseInt(quantity),
                    discount: parseFloat(discount),
                    discountCode: discountCode,
                    remarks: remarks,
                    orderId: orderId
                };
                return $http.put(ENV.serverURL + ENDPOINT + 'item/' + itemId, body);
            },
            generateLink: function(data) {
                /*** What is payPath ***/
                return $http.post(ENV.serverURL + ENV.payPath + '/generate', data);
            },
            getOrders: function(skip, limit, user, sort, state) {
                var url = ENV.serverURL + ENDPOINT + 'orders/' + ENV.vendorKey;
                var queryParams = {};
                if (skip) {
                    queryParams.skip = parseInt(skip);
                }
                if (limit) {
                    queryParams.limit = parseInt(limit);
                }
                if (user) {
                    queryParams.user = user;
                }
                if (sort){
                    queryParams.sortBy = sort;
                }
                if (state){
                    queryParams.state = state;
                }
                var queryData = commonService.serialize(queryParams);

                console.log(queryData);
                if (queryData) {
                    url = url + '?' + queryData;
                    console.log(url);
                }
                return $http.get(url);
            },
            getOrder: function(orderId) {
                return $http.get(ENV.serverURL + ENDPOINT + 'order/' + orderId);
            },
            updateInfo: function(info) {
                var url = ENV.serverURL + ENDPOINT + 'updateInfo/';

                return $http.post(url, info);
            },
            getDeliveryCharge: function() {
                var deferred = $q.defer();
                var query = new Parse.Query('UserKeys');
                query.equalTo('brand', ENV.brand);
                query.first().then(function(key) {
                    if (key) {
                        deferred.resolve(key.get('deliveryCharge'));
                    } else {
                        deferred.resolve(100);
                    }
                }, function(error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            updateCost: function(cost){
                return $http.post(ENV.serverURL + ENDPOINT + 'updateCost', cost);
            }
            //  NOT NEEDED
            // checkout: function(info){
            //     return $http.post("https://www.instamojo.com/api/1.1/payment-requests/ ", {
            //         amount: info.amount,
            //         prupose: "Purchase of Food Items",
            //         buyer_name: info.name,
            //         email: info.email,
            //         phone: info.phone
            //     });
            // }

        };
    }]);
'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:CartCtrl
 * @description
 * # CartCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
    .controller('CartCtrl', ["$log", "$rootScope", "$state", "$uibModal", "$scope", "ENV", "orderService", "localStorageService", "customerService", "accountService", function($log, $rootScope, $state, $uibModal, $scope, ENV, orderService, localStorageService, customerService, accountService) {
        //List of variables
        var vm = this;
        var orderId;
        var name;
        var phone;
        var email;
        var addresses;
        var addressExist;
        var selectedAddress;
        var addressSelected;
        var totalQuantity;
        var checkLoggedIn;
        var currentYear = new Date().getFullYear(); // variable storing current year
        var currentDate = new Date().getDate();  // variable storing current date
        var currentHours = new Date().getHours();  //variable storing current hours
        var currentMonth = new Date().getMonth(); // variable to get current month
        var scheduled;
        var showDay;
        var showMonth;
        var showYear;
        var showHours;
        var showMinutes;
        //Initializing variables

        //for showing selected date
        this.showDay = '';
        this.showMonth = '';
        this.showYear = '';
        this.showHours = '';
        this.showMinutes = '';


        //for date and time
        this.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        this.format = this.formats[0];
        this.altInputFormats = ['M!/d!/yyyy'];
        this.dt = new Date();
        this.popup1 = {};

        //for managing checkout button based on date and time 
        this.scheduled = false;

        //for checking if user is logged in
        if (localStorageService.get('name')) {
            vm.checkLoggedIn = true;
        } else {
            vm.checkLoggedIn = false;
        }

        $scope.totalQuantity = 0;

        // for address
        this.addressExist = false;
        this.customerId = localStorageService.get('userId');
        this.amount = 0;
        this.name = localStorageService.get('name');
        this.phone = localStorageService.get('phone');
        this.addresses = {};
        this.order = {};
        orderId = localStorageService.get('id');
        this.items = [];

        $scope.items = [];

        this.hstep = 1; // var to create change step for hours
        this.mstep = 30;    // var to create change step for minutes


        this.mytime = new Date(currentYear, currentMonth, currentDate, currentHours, 0, 0, 0); // var to get current time for time picker
       
        this.ismeridian = true;
        this.selectedAddress = localStorageService.get('selectedAddress');

        //Checking if address alreadu selected or not
        if (localStorageService.get('selectedAddress')) {
            vm.addressSelected = true;
        } else {
            vm.addressSelected = false;
        }
        // Affixing checkout and address selection card
        $('#checkoutCard').affix({
            offset: {
                top: 10,
            }
        });
        //Setting width of card on affix to value before affix
        $(document).on('affix.bs.affix', '.content', function() {
            $(this).width($(this).width());
        });
        // for fixing affix's position
        $('#checkoutCard').affix('checkPosition');
        //Watcher for total amount
        $scope.$watch('totalQuantity', function(newValue, oldValue) {
            vm.calculateTotal(vm.items);
            $scope.$emit('totalQuantity', totalQuantity);
        });
        //function for change in time picker
        this.changed = function() {
           $log.log('Time changed to: ' + vm.mytime);
        };
        //end of function for change in time picker
        // Function to load items
        this.loadItems = function() {
            console.log('show the loader');
            // initialize array as empty
            vm.items = [];
            $scope.items = [];
            // service to get order items of that customer
            orderService.getOrderItems(orderId)
                .then(function(response) {
                    // since we can get many items we use for each
                    angular.forEach(response.data, function(element) {
                        // if quantity is equal to 1 disable decrease button
                        if (element.quantity === 1) {
                            element.min = true;
                        }
                        // push the items to array
                        vm.items.push(element);
                        $scope.items.push(element);
                        // calculate quantity for cart counter
                        $scope.totalQuantity = $scope.totalQuantity + element.quantity;
                        $scope.$emit('total', totalQuantity);
                    });
                    vm.calculateTotal(vm.items);
                }).catch(function(error) {
                    console.error(error);
                });
            vm.counter++;
            console.log('entering page number ' + vm.counter);
        };
        // Function to remove items
        this.removeItem = function(index) {
            //get item by index
            var item = vm.items[index];
            // change total quantity for cart counter
            $scope.totalQuantity = $scope.totalQuantity - vm.items[index].quantity;
            $scope.$emit('total', totalQuantity);
            // remove item
            vm.items.splice(index, 1);
            // service to remove item from server
            orderService.removeOrderItem(item.id)
                .then(function(response) {
                    console.log(response);
                }).catch(function(error) {
                    console.log(error);
                });
        };
        // Function to increase item quantity
        this.increaseItem = function(index) {
            // for spinner to know change is occuring
            vm.items[index].changing = true;
            // increase quantity count
            vm.items[index].quantity = vm.items[index].quantity + 1;
            //service to update count on server
            orderService.updateOrderItem(vm.items[index].id, vm.items[index].quantity, null, null, null, orderId)
                .then(function(response) {
                    console.log(response);
                    // tell spinner changing is done
                    vm.items[index].changing = false;
                    // if count becomes greater than or equal to 2 then allow user to decrease quantity
                    if (vm.items[index].quantity >= 2) {
                        vm.items[index].min = false;
                    }
                    // change  total quantity for cart counter
                    $scope.totalQuantity = $scope.totalQuantity + 1;
                    $scope.$emit('total', totalQuantity);
                }).catch(function(error) {
                    console.log(error);
                    vm.items[index].changing = false;
                });
        };
        // Function to decrease item quantity
        this.decreaseItem = function(index) {
            // for spinner to know value is changing
            vm.items[index].changing = true;
            // to decrease quantity count
            vm.items[index].quantity = vm.items[index].quantity - 1;
            // service to update order item information
            orderService.updateOrderItem(vm.items[index].id, vm.items[index].quantity, null, null, null, orderId)
                .then(function(response) {
                    console.log(response);
                    // if quantity is less than or equal to one disable decrease item button
                    if (vm.items[index].quantity <= 1) {
                        vm.items[index].min = true;
                    }
                    // stop the changing spinner of item
                    vm.items[index].changing = false;
                    // For showing total number of items in cart
                    $scope.totalQuantity = $scope.totalQuantity - 1;
                    $scope.$emit('total', totalQuantity);
                }).catch(function(error) {
                    console.log(error);
                    vm.items[index].changing = false;
                });
        };
        // Checkout function logic for instamojo
        // this.checkout = function() {
        //     customerService.getAddresses(localStorageService.get('userId'))
        //         .then(function(addresses) {
        //             vm.addresses = addresses;
        //             console.log(vm.addresses);
        //             var data = {
        //                 orderId: localStorageService.get('id'),
        //                 name: vm.name,
        //                 email: vm.email,
        //                 phone: vm.phone,
        //                 amount: vm.order.total,
        //                 successUrl: ENV.successURL,
        //                 webhookUrl: ENV.webhookURL
        //             };
        //             return orderService.generateLink(data)
        //         })
        //         .then(function(response) {
        //             console.log(response);
        //         })
        //         .catch(function(error) {
        //             console.log(error);
        //         });
        // };
        // Function to Calculate sum of all costs
        this.sum = function() {
            // service to get add on taxes
            accountService.getTaxes()
                .then(function(response) {
                    // for each of the taxes applied
                    _.each(response.data, function(data) {
                        // we check which is the default tax
                        if (data.default === true) {
                            // then we set the below variables based on the default tax
                            vm.order.addOnTax.name = data.name;
                            vm.order.addOnTax.amount = vm.order.subtotal * (data.percent / 100);
                            vm.order.addOnTax.percent = data.percent;
                        }
                    });
                    console.log('addOnTax:' + vm.order.addOnTax.amount + ' delivery:' + vm.order.deliveryCharge + ' tax:' + vm.order.tax);
                    // now we add all the values
                    vm.order.total =
                        parseFloat(vm.order.subtotal) +
                        parseFloat(vm.order.tax) +
                        parseFloat(vm.order.addOnTax.amount) +
                        parseFloat(vm.order.deliveryCharge) -
                        parseFloat(vm.order.discount);
                        // we make a variable which contains all details of cost for updating information
                    var cost = {
                        orderId: localStorageService.get('id'),
                        discount: vm.order.discount,
                        roundOff: 0,
                        subtotal: vm.order.subtotal,
                        total: vm.order.total,
                        deliveryCharge: vm.order.deliveryCharge,
                        addOnTax: vm.order.addOnTax,
                        owner: ENV.owner
                    };
                    // service to update information 
                    return orderService.updateCost(cost);
                })
                .then(function(response) {
                    console.log(response.data.id);
                })
                .catch(function(error) {
                    console.log(error);
                });
        };
        //Function to calculate the total amount
        this.calculateTotal = function(items) {
            console.log('calculating total...');
            // initialize the below values as 0 for use
            vm.order.total = vm.order.subtotal = vm.order.tax = vm.order.discount = vm.order.deliveryCharge = 0;
            // also initialize add on taxes as empty object
            vm.order.addOnTax = {};
            _.each(items, function(item) {
                console.log('calculating subtotal');
                // Calculate subtotal 
                vm.order.subtotal += (item.quantity * item.cost);
                // if discount exists calculate it 
                if (item.discount) {
                    vm.order.discount += (item.quantity * item.discount);
                }
                // if tax exists calculate it
                if (item.tax) {
                    vm.order.tax += (item.quantity * item.tax);
                }
                // if delivery charge exists calculate it
                if (item.deliveryCharge) {
                    vm.order.deliveryCharge += (item.quantity * item.deliveryCharge);
                }
                // now find sum of all 
                vm.sum();
            });
        };
        //Function to get order details
        this.getOrderDetails = function(orderId) {
            // service to get order of the user
            orderService.getOrder(orderId)
                .then(function(response) {
                    // response contains the order
                    console.log(response);
                })
                .catch(function(error) {
                    console.log(error);
                });
        };
        // Function to get user's address
        this.getUserAddresses = function() {
            // Use service to get address from server
            customerService.getAddresses(vm.customerId)
                .then(function(addresses) {
                    vm.addresses = addresses;
                    // To check if the user has an address stored in server
                    if (vm.addresses.length === 0) {
                        // if address length is 0 means user has no address in server
                        vm.addressExist = false;
                    } else {
                        // otherwise user has an address on server
                        vm.addressExist = true;
                    }
                }).catch(function(error) {
                    console.log(error);
                });
        };
        // Function to change address
        this.change = function() {
            // Since no address is selected now we set selected address as false 
            vm.addressSelected = false;
            // Also remove address from local storage
            localStorageService.remove('selectedAddress');
        };
        // Function to select address
        this.selectAddress = function(index) {
            vm.selectedAddress = vm.addresses[index];
            // To select address as selected address
            vm.addressSelected = true;
            // Store address in local storage
            localStorageService.set('selectedAddress', vm.selectedAddress);
            // Variable containing order id and address id for updating information
            var info = {
                orderId: localStorageService.get('id'),
                addressId: vm.selectedAddress.id
            };
            // Service to update information on server
            orderService.updateInfo(info)
                .then(function(response) {
                    console.log(response);
                })
                .catch(function(error) {
                    console.log(error);
                });
        };
        //function for opening the date picker
        this.open1 = function(){
            vm.popup1.opened = true;
        }
        //Function to login a user
        this.login = function() {
            $scope.$emit('login');
        };
        // function to set time and date
        this.setTime = function(){
            // to show time and date is set
            vm.scheduled = true;
            // to get time in integer
            var time = (vm.mytime.getHours()*60)+ vm.mytime.getMinutes();

            vm.showDay = vm.dt.getDate();
            vm.showMonth = vm.dt.getMonth()+1;
            vm.showYear = vm.dt.getYear()-100+2000;
            vm.showHours = vm.mytime.getHours();
            vm.showMinutes = vm.mytime.getMinutes();

            // info to be passed to service
            var info = {
                orderId: localStorageService.get('id'),
                date: vm.dt,
                time: time
            }
            // service to update information based on time and date
            orderService.updateInfo(info)
            .then(function(response){
                console.log(response);
            })
            .catch(function(error){
                console.log(error);
            });
        }
        this.resetTime = function(){
            vm.scheduled = false;
        }
        // Options for datepicker
        this.options = {
            minDate: new Date(),
            showWeeks: true
        };
        //Below functions are called on page loading
        this.getUserAddresses();    // tp get user addresses 
        this.loadItems();           // to get order items
        this.getOrderDetails(orderId);      // to get details of the order
    }]);
'use strict';
/**
 * @ngdoc service
 * @name chocoholicsApp.loginservice
 * @description
 * # loginservice
 * Factory in the chocoholicsApp.
 */
angular.module('chocoholicsApp')
    .factory('loginService', ["$http", "$q", "ENV", "localStorageService", function($http ,$q ,ENV, localStorageService) {
        // Service logic
        // ...
        const ENDPOINT = '/customer/';
        var route = '/auth';
        // Public API here
        return {
            loginUser: function(user) {
                var deferred = $q.defer();
                $http.post(ENV.serverURL + route + ENDPOINT + 'login/' + ENV.vendorKey, { phone: user.phone , password: user.password , brand:  ENV.brand, type: ENV.type})
                .then(function(response){
                    console.log(response.data.customer.objectId);
                    localStorageService.set('userId',response.data.customer.objectId);
                    localStorageService.set('token', response.data.token);
                    console.log(localStorageService.get('token'));
                    $http.defaults.headers.common['x-access-token'] = response.data.token;
                    $http.defaults.headers.post['x-access-token'] = response.data.token;
                    $http.defaults.headers.put['x-access-token'] = response.data.token;
                    deferred.resolve(response);
                }).catch(function(error){
                    console.error(error);
                });
                return deferred.promise;


            }
        };
    }]);
'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:LoginmodalCtrl
 * @description
 * # LoginmodalCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
    .controller('LoginmodalCtrl', ["$q", "$state", "$uibModal", "$uibModalInstance", "$scope", "$http", "$rootScope", "loginService", "orderService", "customerService", "localStorageService", "ENV", function($q, $state, $uibModal, $uibModalInstance, $scope, $http, $rootScope, loginService, orderService, customerService, localStorageService, ENV) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        var vm;
        var val;
        var userId;
        var db;
        var state;
        var id;
        vm = this;
        this.user = {};
        this.userId = localStorageService.get('userId');
        this.login = function() {
            loginService.loginUser(vm.user)
                .then(function(response) {
                    localStorageService.set('userId', response.data.customer.objectId);
                    vm.userId = localStorageService.get('userId');
                    localStorageService.set('name', response.data.name.first + ' ' + response.data.name.last || '');
                    localStorageService.set('phone', response.data.customer.phone);
                    localStorageService.set('email', response.data.email);
                    return vm.getUserOrders();
                })
                .then(function(orderId) { // This response will be either an order Id or null
                    console.log(orderId);





                    if(orderId){
                    // If this order id is not null, then compare with the one in localstorage
                        if(localStorageService.get('id') && orderId === localStorageService.get('id')){
                            return true;
                    // if same, then do nothing
                        } else {
                            localStorageService.set('id',orderId);
                            return true;
                    // Replace the id in the LS if this is different from the one stored there

                        }
                    } else {
                    // Else if this order id is null, then create a new order and proceed as before
                        if(localStorageService.get('id')){
                            //If id exits in LS link user to that order id
                            return true;
                        } else {
                            //else if id does not create and order and use that id
                            return orderService.createOrder();
                        }
                    }
                   
                })
                .then(function(response) {
                    if(typeof(response) === "boolean"){
                        if (response.data && response.data.objectId) {
                            localStorageService.set('id', response.data.objectId);
                        }
                    } else {

                    }
                    $uibModalInstance.close('User Logged In');
                    var info = {
                        orderId: localStorageService.get('id'),
                        userId: localStorageService.get('userId'),
                        style: ENV.style
                    };
                    console.log(info);
                    return orderService.updateInfo(info);
                })
                .then(function(response) {
                    console.log(response);
                    console.log(response.data);
                    $uibModalInstance.close();
                    $state.reload();
                })
                .catch(function(error) {
                    console.log(error);
                });
        };
        this.checkUser = function() {
            if (vm.user.phone.length === 10) {
                customerService.checkUser(vm.user.phone)
                    .then(function(response) {
                        console.log(response);
                        console.log(response.data.code);
                        if (response.data.code === 668 || response.data.code === 1001) {
                            $uibModalInstance.dismiss('error 668');
                            vm.register(vm.user.phone);
                        }
                    }).catch(function(error) {
                        console.log(error);
                    });
            }
        };
        this.register = function(phone) {
            var modalInstance = $uibModal.open({
                templateUrl: '/views/registermodal.html',
                size: 'sm',
                controller: 'RegistermodalCtrl',
                ControllerAs: 'register',
                resolve: {
                    phone: function() {
                        return phone;
                    }
                }
            });
        };
        this.cancel = function() {
            $uibModalInstance.close('cancel');
        };
        this.getUserOrders = function() {
            var deferred = $q.defer();
            console.log(vm.userId);
            orderService.getOrders(0, 1, vm.userId, 'createdAt', 'initiated') // Include the state param to make sure only initiated orders are retrieved
                .then(function(response) {
                    console.log(response.data);
                    // The response is from the server, it can have two possible responses



                    if(response.data && response.data.length){
                    // Resolve the final value of the order id and return the promise
                        deferred.resolve(response.data[0].id); 
                    } else {
                    // Else (if the response has an empty array, which means for this user no orders exist on the server) 
                    // resolve null 
                        deferred.resolve(null);
                    }
                    
                }).catch(function(error) {
                    console.log(error);
                    deferred.reject(error.data);
                });

            return deferred.promise;
        };
    }]);
'use strict';
/**
 * @ngdoc service
 * @name chocoholicsApp.customerService
 * @description
 * # customerService
 * Factory in the chocoholicsApp.
 */
angular.module('chocoholicsApp')
    .factory('customerService', ["ENV", "$http", "$q", "loginService", "orderService", "localStorageService", function(ENV, $http, $q, loginService, orderService, localStorageService) {
        // Service logic
        // ...
        var route = '/customer';
        // Public API here
        return {
            checkUser: function(phone) {
                return $http.get(ENV.serverURL + route + '/check/' + ENV.vendorKey + '?phone=' + phone);
            },
            registerUser: function(user) {
                var deferred = $q.defer();
                $http.post(ENV.serverURL + route + '/register/' + ENV.vendorKey, {
                        phone: user.phone,
                        password: user.password,
                        brand: ENV.brand,
                        email: user.email,
                        name: user.name
                    })
                    .then(function(response) {
                        console.log('reached login');
                        return loginService.loginUser(user);
                    })
                    .then(function(response) {
                        console.log('reached orderService');
                        if(localStorageService.get('id')){
                            return true;
                        } else {
                            return orderService.createOrder();
                        }    
                    })
                    .then(function(response) {
                        //from here
                        var info = {
                            orderId: localStorageService.get('id'),
                            userId: localStorageService.get('userId'),
                            style: ENV.style
                        };
                        return orderService.updateInfo(info);
                        //till here
                    })
                    .then(function(response) {
                        console.log(response);
                        deferred.resolve();
                    })
                    .catch(function(error) {
                        console.error(error);
                        deferred.reject(error);
                    });
                return deferred.promise;
            },

            // addAddress: function(newAddress , id){
            //     return $http.post(ENV.serverURL + route + '/addAddress/' + id , {
            //         flatBldgName: newAddress.flatBldgName,
            //         street: newAddress.street,
            //         landmark: newAddress.landmark,
            //         pincode: newAddress.pincode,
            //         city: newAddress.city,
            //         state: newAddress.state
            //     });
            // },
            // getAddress: function(id){
            //     return $http.get(ENV.serverURL + route + '/getAddress/' + id);
            // }

            addAddress: function(newAddress, customerId) {
                console.log(newAddress);
                var deferred = $q.defer();
                var query = new Parse.Query('Customer');
                query.get(customerId).then(function(customer) {
                    var Address = new Parse.Object.extend('Address');
                    var address = new Address();
                    address.set('flatBldgName', newAddress.flatBldgName);
                    address.set('street', newAddress.street);
                    address.set('landmark', newAddress.landmark);
                    address.set('pincode', newAddress.pincode);
                    address.set('state', newAddress.state);
                    address.set('city', newAddress.city);
                    address.set('vendor', ENV.vendorKey);
                    address.save().then(function(address) {
                        var addressRelation = customer.relation('address');
                        addressRelation.add(address);
                        return customer.save();
                    }).then(function(customer) {
                        deferred.resolve(customer);
                    }, function(error) {
                        deferred.reject(error);
                    });
                }, function(error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getAddresses: function(customerId) {
                var deferred = $q.defer();
                var query = new Parse.Query('Customer');
                var addressList = [];
                query
                    .get(customerId)
                    .then(function(customer) {
                        var relation = customer.relation('address');
                        var relationQuery = relation.query();
                        relationQuery.equalTo('vendor', ENV.vendorKey);
                        return relationQuery.find();
                    }).then(function(addresses) {
                        angular.forEach(addresses, function(address) {
                            addressList.push({
                                id: address.id,
                                flatBldgName: address.get('flatBldgName'),
                                street: address.get('street'),
                                landmark: address.get('landmark'),
                                city: address.get('city'),
                                state: address.get('state'),
                                pincode: address.get('pincode')
                            });
                        });
                        deferred.resolve(addressList);
                    }, function(error) {
                        deferred.resolve(error);
                    });
                return deferred.promise;
            },
            getAddress: function(id) {
                var deferred = $q.defer();
                var query = new Parse.Query('Address');
                query
                    .get(id)
                    .then(function(address) {
                        deferred.resolve({
                            id: address.id,
                            flatBldgName: address.get('flatBldgName'),
                            street: address.get('street'),
                            landmark: address.get('landmark'),
                            city: address.get('city'),
                            state: address.get('state'),
                            pincode: address.get('pincode')
                        });
                    }, function(error) {
                        deferred.resolve(error);
                    });
                return deferred.promise;
            },

        };
    }]);
'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:RegistermodalCtrl
 * @description
 * # RegistermodalCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
    .controller('RegistermodalCtrl', ["$scope", "$uibModalInstance", "phone", "customerService", "loginService", function($scope, $uibModalInstance, phone, customerService, loginService) {
        $scope.user = {};
        if (phone) {
            $scope.user.phone = phone;
        }
        $scope.register = function() {
            customerService.registerUser($scope.user)
                .then(function() {
                    $uibModalInstance.close();
                }).catch(function(error) {
                    console.log(error);
                    $scope.error = error;
                    $uibModalInstance.dismiss();
                });
        };
    }]);
'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
    .controller('AccountCtrl', ["$scope", "localStorageService", "orderService", "customerService", function($scope, localStorageService, orderService, customerService) {
        // List of variables        
        var name;
        var phone;
        var email;
        var id;
        var checker; 
        //Variable Definition
        $scope.orders = [];
        $scope.customerId = localStorageService.get('userId');
        $scope.name = localStorageService.get('name');
        $scope.phone = localStorageService.get('phone');
        $scope.email = localStorageService.get('email');
        $scope.checker = false;
        $scope.moment;
        $scope.isInitiated = false;
        //Function to get user address
        $scope.getUserAddresses = function() {
            // service to get customer's address
            customerService.getAddresses($scope.customerId)
                .then(function(addresses) {
                    //setting the address
                    $scope.addresses = addresses;
                    $scope.$emit('load-end');
                    console.log($scope.addresses);
                    // to check if address exists
                    if ($scope.addresses.length === 0) {
                        // in this case address does not exist
                        $scope.checker = false;
                        console.log($scope.checker);
                    } else {
                        // in this case address exists
                        $scope.checker = true;
                        console.log($scope.checker);
                    }
                }, function(error) {
                    $scope.$emit('error', error.message);
                });
        };
        //Function to save address
        $scope.saveAddress = function() {
            console.log($scope.newAddress);
            console.log($scope.customerId);
            //service to add address to server
            customerService
                .addAddress($scope.newAddress, $scope.customerId)
                .then(function(address) {
                    console.log(address);
                }, function(error) {
                    $scope.$emit('error', error.message);
                });
        };
        //Function to get Order History
        $scope.getOrderHistory = function(skip, limit, user) {
            //service to get orders of the user from the server
            orderService.getOrders(skip, limit, user, 'createdAt')
                .then(function(response) {
                    console.log(response);
                    // for each order since we can have many orders
                    angular.forEach(response.data, function(element) {
                        $scope.orders.push(element);
                        // if order state is initiated find time to delivery and show it on html
                        if(element.state === "initiated"){
                            $scope.moment=moment(element.date, "YYYYMMDD").fromNow();
                            $scope.isInitiated = true;
                        }
                    });
                    console.log($scope.orders);
                }).catch(function(error) {
                    console.log(error);
                });
        };
        //Function to add more addresses
        $scope.addMore = function() {
            $scope.checker = false;
        };
        // these functions to be called on page load
        $scope.getOrderHistory(0, 10, $scope.customerId);
        $scope.getUserAddresses($scope.customerId);
        console.log(this.checker);
    }]);
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
'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
    .controller('HomeCtrl', ["productService", function(productService) {
        var vm = this;
        this.products = [];
        this.getTopProducts = function() {
            productService.getProducts(0, 4, 'updatedAt')
                .then(function(response) {
                    // console.log(response.data);
                    angular.forEach(response.data, function(element) {
                        vm.products.push(element);
                    });
                })
                .catch(function(error) {
                    console.log(error);
                });
        };

        // FOR IMAGES OF TOP 3 PRODUCTS
        this.loadImages = function() {
            productService.getImages(imageId)
                .then(function(image) {
                    console.log(image);
                }).catch(function(error) {
                    console.log(error);
                });
        };
        //this.loadImages();
        this.getTopProducts();
    }]);
'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:AddressselectcontrollerCtrl
 * @description
 * # AddressselectcontrollerCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
    .controller('AddressselectCtrl', ["$uibModal", "$uibModalInstance", "localStorageService", "orderService", "customerService", function($uibModal, $uibModalInstance, localStorageService, orderService, customerService) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        var customerId;
        var vm = this;
        var addresses;
        var selectedAddress;
        var selected;
        this.selectedAddress = {};
        this.addresses = {};
        this.customerId = localStorageService.get('userId');
        if(localStorageService.get('selectedAddress')){
            vm.selectedAddress = localStorageService.get('selectedAddress');
            this.selected = true;
        } else {
            this.selected = false;
        }
        this.getUserAddresses = function() {
            customerService.getAddresses(vm.customerId)
                .then(function(addresses) {
                    vm.addresses = addresses;
                    console.log(vm.addresses);
                }).catch(function(error) {
                    console.log(error);
                });
        };
        this.cancel = function() {
            $uibModalInstance.close('cancel');
        };
        this.selectAddress = function(index){
            vm.selectedAddress = vm.addresses[index];
            this.selected = true;
            localStorageService.set('selectedAddress', vm.selectedAddress);
            var info = {
                orderId: localStorageService.get('id'),
                addressId: vm.selectedAddress.id
            };
            orderService.updateInfo(info)
            .then(function(response){
                console.log(response);
            })
            .catch(function(error){
                console.log(error);
            });
        };
        this.reselect = function(){
            this.selected = false;
            localStorageService.remove('selectedAddress');
        };
        this.getOrderDetails = function(){
            orderService.getOrder()
            .then(function(response){
                console.log(response);
            })
            .catch(function(error){
                console.log(error);
            });
        };
        this.confirm = function(){
            $uibModalInstance.close();
            var ModalInstance = $uibModal.open({
                templateUrl: '/views/confirm.html',
                controller: 'ConfirmCtrl',
                controllerAs: 'confirm'
            });
        };
        this.getUserAddresses();
    }]);
'use strict';
angular.module('chocoholicsApp')
  .controller('ConfirmCtrl', ["localStorageService", "orderService", function (localStorageService, orderService) {
  	var orderId = localStorageService.get('id');
  	var vm = this;
  	this.total = 0;
    this.getTotalAmount = function(){
    	orderService.getOrder(orderId)
    	.then(function(response){
    		console.log(response);
    		vm.total = response.data.total;
    	})
    	.catch(function(error){
    		console.log(error);
    	});
    };
    this.getTotalAmount();
  }]);

'use strict';
angular.module('chocoholicsApp')
  .controller('PasswordchangeCtrl', function () {
  });

'use strict';
angular.module('chocoholicsApp')
  .service('accountService', ["ENV", "$http", function (ENV, $http) {
  	const ENDPOINT = "/account/";
  	return{
  		getTaxes: function(){
  			return $http.get(ENV.serverURL + ENDPOINT + 'taxes/' + ENV.vendorKey + '?user=' + ENV.owner);
  		}
  	};
  }]);
