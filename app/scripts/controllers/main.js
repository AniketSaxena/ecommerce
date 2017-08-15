'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
  .controller('MainCtrl', function($aside, $state, $scope, $uibModal, localStorageService, $http, customerService) {
    //Variables
    var vm = this;
    var items;
    this.checker = true;
    this.tatal = 0;
    this.cartChecker = false;


    //Variable Definition
    items = localStorageService.get('quantity');

    /*==========================================
    =            Events & Listeners            =
    ==========================================*/

    //Listening for log In
    $scope.$on('login', function() {
      vm.open();
    });

    $scope.$on('reset-password', function(event, args) {
      if (args) {
        vm.openReset(args.phone, args.email, args.customerId);
      } else {
        vm.openReset();
      }
    });

    //Listening for log out
    $scope.$on('logout', function() {
      vm.logout();
    });

    // for navbar collapse on click
    $('.nav a').on('click', function() {
      $('.navbar-toggle').click(); //bootstrap 3.x by Richard
    });

    //Listening for getting total items
    // $scope.$on('totalQuantity', function(totalQuantity) {
    //   console.log(totalQuantity.targetScope.totalQuantity);
    //   vm.total = totalQuantity.targetScope.totalQuantity;
    // });
    $scope.$on('LocalStorageModule.notification.setitem', function(event, args) {
      console.log(args);
      if (args.key === 'cart') {
        vm.total = parseFloat(args.newvalue);
      }
      // vm.total = args.count;
    });

    // Listening for any error
    $scope.$on('handleError', function(event, args) {
      vm.handleError(args.error, args.title);
    });

    //Listening for log out
    $scope.$on('add', function() {
      vm.total++;
    });

    this.total = parseFloat(localStorageService.get('cart'));

    /*=====  End of Events & Listeners  ======*/

    /**
     * Function to open the login modal
     * @return {void} 
     */
    this.open = function() {
      $uibModal.open({
        templateUrl: 'views/loginmodal.html',
        size: 'sm',
        controller: 'LoginmodalCtrl',
        controllerAs: 'login'
      }).result.then(function(message) {
        vm.checkLoggedIn();
        if (message === 'open-reset') {
          $scope.$emit('reset-password');
        }
      }).catch(function(error) {
        if (error) {
          $scope.$emit('handleError', { error: error });
        }
      });
    };

    /**
     * Function to end session and log the current user out
     * @return {void} 
     */
    this.logout = function() {
      vm.cartChecker = false;
      vm.total = 0;
      //This function removes the following items from local storage
      localStorageService.remove('name');
      localStorageService.remove('phone');
      localStorageService.remove('email');
      localStorageService.remove('userId');
      localStorageService.remove('id');
      localStorageService.remove('token');
      localStorageService.remove('selectedAddress');
      vm.isLoggedIn = false;
      $state.go('main.home');
    };

    /**
     * Function to check if a user is logged in
     * @return {void} 
     */
    this.checkLoggedIn = function() {
      if (localStorageService.get('name')) {
        vm.isLoggedIn = true;
        vm.customerName = localStorageService.get('name');
        vm.customerEmail = localStorageService.get('email');
      } else {
        customerService.createDummySession().then(function(response) {
          var tokenData = response.data.token;
          localStorageService.set('token', tokenData);
          $http.defaults.headers.common['x-access-token'] = response.data.token;
          $http.defaults.headers.post['x-access-token'] = response.data.token;
          $http.defaults.headers.put['x-access-token'] = response.data.token;
        });
      }
    };

    /**
     * Open the side nav
     * @return {void} 
     */
    this.openAside = function() {
      $aside.open({
        templateUrl: 'views/aside.html',
        controller: 'AsideCtrl',
        placement: 'left',
        size: 'lg',
        resolve: {
          isLoggedIn: function() {
            return vm.isLoggedIn;
          }
        }
      });
    };


    /**
     * Function to handle the error, globally
     * @param  {Object} error Object containing error message and code
     * @return {void}       
     */
    this.handleError = function(error, title) {
      $uibModal.open({
        templateUrl: 'views/errorModal.html',
        size: 'sm',
        controller: 'ErrormodalCtrl',
        resolve: {
          error: function() {
            return error;
          },
          title: function() {
            return title;
          }
        }
      });
    };

    /**
     * Function to handle the error, globally
     * @param  {Object} error Object containing error message and code
     * @return {void}       
     */
    this.openReset = function(phone, email, customerId) {
      $uibModal.open({
          templateUrl: 'views/changemodal.html',
          size: 'sm',
          controller: 'ChangeModalCtrl',
          resolve: {
            phone: function() {
              return phone;
            },
            email: function() {
              return email;
            },
            customerId: function() {
              return customerId;
            }
          }
        }).result.then(function(result) {
          if (result === 'logout') {
            $scope.$emit('logout');
          } else {
            $state.go('main.home');
          }
        })
        .catch(function(error) {
          console.error(error);
        });
    };

    // During init, check if the user is logged in
    this.checkLoggedIn();
  });
