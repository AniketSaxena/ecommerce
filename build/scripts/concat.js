'use strict';
angular
    .module('chocoholicsApp', [
        'ngAnimate',
        'ngAria',
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
    .config(["$stateProvider", "$urlRouterProvider", "localStorageServiceProvider", "$locationProvider", "ENV", function($stateProvider, $urlRouterProvider, localStorageServiceProvider, $locationProvider, ENV) {
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
            name: 'main.passwordChange',
            url: '/passwordChange?pass&id',
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


    }])
    .run(["$http", "localStorageService", "ENV", function($http, localStorageService, ENV) {
        Parse.initialize(ENV.parseAPIKey, ENV.parseJsKey);
        Parse.serverURL = ENV.serverURL + ENV.parsePath;
        var token = localStorageService.get('token');
        if (token) {
            // $http.defaults.headers.common['x-access-token'] = token;
            $http.defaults.headers.post['x-access-token'] = token;
            $http.defaults.headers.put['x-access-token'] = token;
        }
    }]);
angular.module('config', [])

.constant('ENV', {serverURL:'https://use.proplco.com',vendorKey:'12fcacee2d11a158c4ac6dcf12bc71eb',myGovAPI:'210d0d0cbf2c9c3ede9bda8f25e89533',owner:'8PmVIkY5sK',style:'delivery',mode:'website',type:'local',payPath:'/pay',brand:'chocohollics',parseAPIKey:'MbAe6hoy43d3uInM0TISC1dBePxocl4eLL4B0Tig',parseJsKey:'bdKP5OkzKFPQt4RKURwhK7blDLTr6xScCxNuSPwY',parsePath:'/parse',webhookURL:'https://use.proplco.com/pay/update',successURL:'http://chocohollics.com/#/main/confirm',build:'production',vendorId:'8Wm0DoBfqA',myGovURL:'//api.data.gov.in/resource/6176ee09-3d56-4a3b-8115-21841576b2f6?format=json&api-key='})

.value('debug', true)

;
'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
  .controller('AccountCtrl', ["ENV", "$state", "$scope", "localStorageService", "orderService", "customerService", "$location", function(ENV, $state, $scope, localStorageService, orderService, customerService, $location) {
    /**
     * Function to get the list of addresses for this user
     * @return {void} 
     */
    $scope.getUserAddresses = function() {
      customerService.getAddresses($scope.customerId)
        .then(function(response) {
          var addresses = response.data;
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
        }).catch(function(error) {
          $scope.$emit('handleError', { error: error });
          console.log(error);
          //             $scope.$emit('error', error.message);
        });
    };

    /**
     * Function to save the address to user profile
     * @return {[type]} [description]
     */
    $scope.saveAddress = function() {
      $scope.loading = true;
      //service to add address to server
      if (!$scope.newAddress.id) {
        // Save a new address
        customerService
          .addAddress($scope.newAddress, $scope.customerId)
          .then(function(address) {
            $scope.loading = false;

            console.log(address);
            $scope.$emit('handleError', { error: { message: 'Address added!' }, title: 'Information Updated' });
            // $state.reload();
            if ($location.search() && $location.search().back) {
              $state.go('main.cart');
            } else {
              $scope.getUserAddresses();
            }
          }).catch(function(error) {
            $scope.loading = false;

            $scope.$emit('handleError', { error: error.data });
            console.error(error);
          });
      } else {
        customerService
          .updateAddress($scope.newAddress.id, $scope.newAddress)
          .then(function(address) {
            $scope.loading = false;

            console.log(address);
            // $state.reload();
            $scope.$emit('handleError', { error: { message: 'Address updated!' }, title: 'Information Updated' });
            $scope.getUserAddresses();
          }).catch(function(error) {
            $scope.$emit('handleError', { error: error.data });
            console.error(error);
            $scope.loading = false;

          });
      }

    };

    /**
     * Function to get the order history
     * @param  {Integer} skip  Page number
     * @param  {Integer} limit Page size
     * @param  {String} user  ID of the user
     * @return {void}       
     */
    $scope.getOrderHistory = function(skip, limit, user) {
      //service to get orders of the user from the server
      orderService.getOrders(skip, limit, user, 'createdAt')
        .then(function(response) {
          console.log(response);
          // for each order since we can have many orders
          angular.forEach(response.data, function(element) {
            element.url = ENV.serverURL + '/view/' + element.id;
            $scope.orders.push(element);
            console.log($scope.orders);
          });
          console.log($scope.orders);
        }).catch(function(error) {
          $scope.$emit('handleError', { error: error });
          console.log(error);
        });
    };

    /**
     * Function to remove an existing address
     * @param  {Object} address Address selected
     * @param  {Integer} index   Index in the list of addresses
     * @return {void}         
     */
    $scope.removeAddress = function(address, index) {
      customerService.removeAddress(address.id)
        .then(function(response) {
          console.log(response);
          $scope.addresses.splice(index, 1);
        }).catch(function(error) {
          $scope.$emit('handleError', { error: error });
          console.log(error);
        });
    };


    $scope.editAddress = function(address) {
      $scope.checker = false;
      $scope.newAddress = address;
    };

    /**
     * [addMore description]
     */
    $scope.addMore = function() {
      $scope.checker = false;
    };

    /**
     * [goBack description]
     * @return {[type]} [description]
     */
    $scope.goBack = function() {
      $scope.checker = true;
    };

    /**
     * Function to get city and state based on pincode
     * @return {void} 
     */
    $scope.changePin = function() {
      if ($scope.newAddress.pincode && $scope.newAddress.pincode.toString().length === 6) {
        customerService.changePin($scope.newAddress.pincode)
          .then(function(response) {
            console.log(response);
            var pinData = response.data;
            $scope.newAddress.city = pinData.records[0].regionname;
            $scope.newAddress.state = pinData.records[0].statename;
          })
          .catch(function(error) {
            console.error(error);
            $scope.$emit('handleError', { error: error });
          });
      }
    };

    $scope.pre = function() {

      // these functions to be called on page load

      //Variable Definition
      $scope.newAddress = {};
      $scope.orders = [];
      $scope.customerId = localStorageService.get('userId');
      $scope.name = localStorageService.get('name');
      $scope.phone = localStorageService.get('phone');
      $scope.email = localStorageService.get('email');
      $scope.checker = false;
      $scope.isInitiated = false;
      // To show top of page when page loads
      $(document).ready(function() {
        $(this).scrollTop(0);
      });

      if ($scope.customerId) {
        $scope.getOrderHistory(0, 10, $scope.customerId);
        $scope.getUserAddresses();
      } else {
        $scope.$emit('login');
        $state.go('main.home');
      }

    };

    $scope.pre();

    $scope.changePassword = function() {
      $scope.$emit('reset-password', { phone: $scope.phone, email: $scope.email, customerId: $scope.customerId });
    };

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
  .controller('AddressselectCtrl', ["$scope", "$uibModal", "$uibModalInstance", "localStorageService", "orderService", "customerService", function($scope, $uibModal, $uibModalInstance, localStorageService, orderService, customerService) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    var vm = this;
    this.selectedAddress = {};
    this.addresses = {};
    this.customerId = localStorageService.get('userId');
    if (localStorageService.get('selectedAddress')) {
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
          $scope.$emit('handleError', { error: error });

          console.log(error);
        });
    };
    this.cancel = function() {
      $uibModalInstance.close('cancel');
    };
    this.selectAddress = function(index) {
      vm.selectedAddress = vm.addresses[index];
      this.selected = true;
      localStorageService.set('selectedAddress', vm.selectedAddress);
      var info = {
        orderId: localStorageService.get('id'),
        addressId: vm.selectedAddress.id
      };
      orderService.updateInfo(info)
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          $scope.$emit('handleError', { error: error });

          console.log(error);
        });
    };
    this.reselect = function() {
      this.selected = false;
      localStorageService.remove('selectedAddress');
    };
    this.getOrderDetails = function() {
      orderService.getOrder()
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          $scope.$emit('handleError', { error: error });

          console.log(error);
        });
    };
    this.getUserAddresses();
  }]);

'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:AsidectrlCtrl
 * @description
 * # AsidectrlCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
  .controller('AsideCtrl', ["$uibModalInstance", "$scope", "$rootScope", "localStorageService", "isLoggedIn", function($uibModalInstance, $scope, $rootScope, localStorageService, isLoggedIn) {
    // to set as active
    $('#tab').click(function(e) {
      e.preventDefault();
      // $(this).tab('show')
      $(this).parent().find('li').removeClass('active');
      $(this).addClass('active');
    });
    // to get name
    if (localStorageService.get('name')) {
      $scope.name = localStorageService.get('name');
    }
    if (localStorageService.get('email')) {
      $scope.email = localStorageService.get('email');
    }
    // to check if user logged in
    $scope.loginChecker = isLoggedIn;
    console.log($scope.loginChecker);
    //functions
    $scope.login = function() {
      $rootScope.$broadcast('login');
      $uibModalInstance.close();
    };
    $scope.logout = function() {
      $rootScope.$broadcast('logout');
      $uibModalInstance.close();
    };
    $scope.close = function() {
      $uibModalInstance.close();
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
    this.checkLoggedIn = false;
    var totalQuantity;
    var currentYear = new Date().getFullYear(); // variable storing current year
    var currentDate = new Date().getDate(); // variable storing current date
    var currentHours = new Date().getHours(); //variable storing current hours
    var currentMonth = new Date().getMonth(); // variable to get current month
    //Initializing variables
    //for date and time
    this.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    this.format = this.formats[0];
    this.altInputFormats = ['M!/d!/yyyy'];
    this.dt = new Date();
    this.popup1 = {};
    //for managing checkout button based on date and time
    this.scheduled = false;

    $scope.totalQuantity = 0;
    // for address
    this.addressExist = false;
    this.customerId = localStorageService.get('userId');
    this.amount = 0;
    this.name = localStorageService.get('name');
    this.phone = localStorageService.get('phone');
    this.addresses = [];
    this.order = {};
    orderId = localStorageService.get('id');
    this.items = [];
    this.hstep = 1; // var to create change step for hours
    this.mstep = 30; // var to create change step for minutes
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
    $scope.$watch('totalQuantity', function(newValue) {
      vm.calculateTotal(vm.items);
      $scope.$emit('totalQuantity', newValue);
    });


    //function for change in time picker
    this.changed = function() {
      $log.log('Time changed to: ' + vm.mytime);
    };


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
          $scope.$emit('handleError', { error: error });
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
          $scope.$emit('handleError', { error: error });
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
          $scope.$emit('handleError', { error: error });
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
          $scope.$emit('handleError', { error: error });
          console.error(error);
          vm.items[index].changing = false;
        });
    };


    /**
     * Function to generate IM payment link
     * @return {void}
     */
    this.checkout = function() {
      vm.loading = true;
      var data = {
        orderId: localStorageService.get('id'),
        name: vm.name,
        email: vm.email,
        phone: vm.phone,
        successUrl: ENV.successURL,
        webhookUrl: ENV.webhookURL
      };
      console.log(data);
      orderService.generateLink(data)
        .then(function(response) {
          vm.paymentLink = response.data.payment_request.longurl;
          vm.loading = false;
          console.log(response);
        })
        .catch(function(error) {
          vm.loading = false;
          $scope.$emit('handleError', { error: error.data });
          console.error(error);
        });
    };

    /**
     * Function to calculate totals
     * @return {void} 
     */
    this.sum = function() {
      vm.loading = true;
      vm.addOnTaxes = [];
      // service to get add on taxes
      accountService.getTaxes()
        .then(function(response) {
          // for each of the taxes applied
          var taxes = response.data;
          var taxAmount = 0;
          vm.addOnTaxes = _.map(taxes, function(tax) {
            if (tax.default) {
              tax.amount = (vm.order.subtotal * tax.percent) / 100;
              taxAmount = taxAmount + tax.amount;
              return tax;
            }
          });
          console.log('addOnTax:' + taxAmount + ' delivery:' + vm.order.deliveryCharge + ' tax:' + vm.order.tax);
          // now we add all the values
          var total =
            parseFloat(vm.order.subtotal) +
            parseFloat(vm.order.tax) +
            parseFloat(taxAmount) +
            parseFloat(vm.order.deliveryCharge) -
            parseFloat(vm.order.discount);
          console.log(vm.order.total);
          // we make a variable which contains all details of cost for updating information
          var cost = {
            orderId: localStorageService.get('id'),
            discount: vm.order.discount,
            roundOff: 0,
            subtotal: vm.order.subtotal,
            total: total,
            deliveryCharge: vm.order.deliveryCharge,
            addOnTax: vm.order.addOnTax,
            owner: ENV.owner
          };
          // service to update information
          if (vm.order.total !== total) {
            vm.order.total = total;
            return orderService.updateCost(cost);
          } else {
            return true;
          }

        })
        .then(function() {
          vm.loading = false;
        })
        .catch(function(error) {
          $scope.$emit('handleError', { error: error });
          console.error(error);
        });
    };

    //Function to calculate the total amount
    this.calculateTotal = function(items) {
      console.log('calculating total...');
      // initialize the below values as 0 for use
      vm.order.subtotal = 0;
      // also initialize add on taxes as empty object
      vm.order.addOnTax = {};
      _.each(items, function(item) {
        console.log('calculating subtotal');
        // Calculate subtotal
        vm.order.subtotal += (item.quantity * item.cost);
        console.log(vm.order.subtotal);
        // if discount exists calculate it
        if (item.discount) {
          vm.order.discount += (item.quantity * item.discount);
        }
        // if tax exists calculate it
        if (item.tax) {
          vm.order.tax += (item.quantity * item.tax);
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
          vm.order = response.data;
          vm.loadItems();
        })
        .catch(function(error) {
          $scope.$emit('handleError', { error: error });
          console.log(error);
        });
    };

    // Function to get user's address
    this.getUserAddresses = function() {
      // Use service to get address from server
      customerService.getAddresses(vm.customerId)
        .then(function(response) {
          vm.addresses = response.data;
          // To check if the user has an address stored in server
          if (vm.addresses.length === 0) {
            // if address length is 0 means user has no address in server
            vm.addressExist = false;
          } else {
            // otherwise user has an address on server
            vm.addressExist = true;
            if(vm.order.addressId){
              var selectedIndex = _.findIndex(vm.addresses, {id: vm.order.addressId});
              vm.selectAddress(selectedIndex);
            }
          }
        }).catch(function(error) {
          $scope.$emit('handleError', { error: error });
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
          return accountService.getPincodes();
        })
        .then(function(response) {
          var pincodes = response.data;
          console.log(pincodes);
          var matchedPin = _.where(pincodes, { pincode: vm.selectedAddress.pincode });
          vm.order.deliveryCharge = matchedPin[0].charges;
          vm.sum();
        })
        .catch(function(error) {
          $scope.$emit('handleError', { error: error });
          console.log(error);
        });
    };

    //function for opening the date picker
    this.open1 = function() {
      vm.popup1.opened = true;
    };

    //Function to login a user
    this.login = function() {
      $scope.$emit('login');
    };

    // function to set time and date
    this.setTime = function() {
      // to show time and date is set
      vm.scheduled = true;
      // to get time in integer
      var time = (vm.mytime.getHours() * 60) + vm.mytime.getMinutes();
      vm.showDay = vm.dt.getDate();
      vm.showMonth = vm.dt.getMonth() + 1;
      vm.showYear = vm.dt.getYear() - 100 + 2000;
      vm.showHours = vm.mytime.getHours();
      vm.showMinutes = vm.mytime.getMinutes();
      // info to be passed to service
      var info = {
        orderId: localStorageService.get('id'),
        date: vm.dt,
        time: time
      };
      // service to update information based on time and date
      orderService.updateInfo(info)
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          $scope.$emit('handleError', { error: error });
          console.log(error);
        });
    };

    this.resetTime = function() {
      vm.scheduled = false;
    };

    this.pre = function() {

      // Options for datepicker
      vm.options = {
        minDate: new Date(),
        showWeeks: false,
      };


      //Below functions are called on page loading
      vm.getUserAddresses(); // tp get user addresses
      if (orderId) {
        vm.getOrderDetails(orderId); // to get details of the order
      }

      //for checking if user is logged in
      if (localStorageService.get('name')) {
        vm.checkLoggedIn = true;
      } else {
        vm.checkLoggedIn = false;
      }

    };

    this.pre();


  }]);

'use strict';

/**
 * @ngdoc function
 * @name chocoholicsApp.controller:ChangeModalCtrl
 * @description
 * # ChangeModalCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
  .controller('ChangeModalCtrl', ["$scope", "loginService", "$state", "phone", "email", "customerId", "localStorageService", "$uibModalInstance", "$rootScope", "customerService", function($scope, loginService, $state, phone, email, customerId, localStorageService, $uibModalInstance, $rootScope, customerService) {

    $scope.pre = function() {
      $scope.phone = phone;
      $scope.customerId = customerId;
    };

    $scope.pre();

    $scope.changePassword = function() {
      $scope.loading = true;

      loginService
        .forgotPassword($scope.customerId, $scope.phone)
        .then(function(response) {
          console.log(response);
          $scope.loading = false;

          var message = 'We have sent an email';
          if (email) {
            message = message + ' to ' + email;
          }
          message = message + '. Please follow the instructions there to change your password';

          $scope.$emit('handleError', {
            error: 'We have logged you out of the web site, and an email has been sent to ' +
              $scope.email +
              '. Please follow the instructions there to change your password',
            title: 'Password change request done'
          });

          if (localStorageService.get('name')) {
            $uibModalInstance.close('logout');
          } else {
            $uibModalInstance.close();
          }
        })
        .catch(function(error) {
          $scope.loading = false;

          console.error(error);
          $scope.error = error.data.message;
        });
    };

    $scope.$watch('phone', function(newValue) {
      if (newValue && newValue.toString().length === 10) {
        $scope.loading = true;

        customerService.getEmail(newValue).then(function(response) {
            console.log(response);
            $scope.email = response.data.email;
            $scope.customerId = response.data.id;
            $scope.loading = false;

          })
          .catch(function(error) {
            $scope.loading = false;

            $scope.error = error.data.message;
            console.error(error);
          });
      }
    });

  }]);

'use strict';
angular.module('chocoholicsApp')
  .controller('ConfirmCtrl', ["$scope", "localStorageService", "orderService", function($scope, localStorageService, orderService) {
    var orderId = localStorageService.get('id');
    var vm = this;
    this.total = 0;
    this.getTotalAmount = function() {
      orderService.getOrder(orderId)
        .then(function(response) {
          vm.order = response.data;
          if (vm.order.paymentId && vm.order.paymentId.length) {
            localStorageService.remove('id');
          }
        })
        .catch(function(error) {
          $scope.$emit('handleError', { error: error });
          console.log(error);
        });
    };
    this.getTotalAmount();
  }]);

'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:ErrormodalCtrl
 * @description
 * # ErrormodalCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
  .controller('ErrormodalCtrl', ["$scope", "error", "title", function($scope, error, title) {
    $scope.title = title || 'An error has occured';

    if (error && error.message) {
      $scope.errorMessage = error.message;
    }

    if (error && typeof error === 'string') {
      $scope.errorMessage = error;
    }
  }]);

'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
  .controller('HomeCtrl', ["$scope", "productService", function($scope, productService) {
    var vm = this;
    this.products = [];



    this.loadImages = function(images, index) {
      productService.getImages(images[0].objectId).then(function(image) {
          vm.products[index].image = image;
          console.log(vm.products[index]);
        })
        .catch(function(error) {
          console.error(error);
          $scope.$emit('handleError', { error: error });
        });
    };


    this.getTopProducts = function() {
      productService.getProducts(0, 4, 'updatedAt', null)
        .then(function(response) {
          angular.forEach(response.data, function(element, index) {
            vm.products.push(element);
            if (element.images && element.images.length) {
              vm.loadImages(element.images, index);
            }
          });
        })
        .catch(function(error) {
          $scope.$emit('handleError', { error: error });

          console.log(error);
        });
    };


    this.pre = function() {

      // To show top of page when page loads
      $(document).ready(function() {
        $(this).scrollTop(0);
      });
      
      vm.imageOptions = {
        nolazy: true,
        background: true,
        imgAttrs: [{
          class: 'img-responsive animated fadeIn'
        }]
      };

      vm.getTopProducts();
    };

    this.pre();

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

    $scope.user = {};
    $scope.userId = localStorageService.get('userId');


    $scope.login = function() {
      $scope.loading = true;
      loginService.loginUser($scope.user)
        .then(function(response) {
          console.log(response);
          localStorageService.set('userId', response.data.customer.objectId);
          $scope.userId = localStorageService.get('userId');
          localStorageService.set('name', response.data.name.first + ' ' + response.data.name.last || '');
          localStorageService.set('phone', response.data.customer.phone);
          localStorageService.set('email', response.data.email);
          return $scope.getUserOrders();
        })
        .then(function(orderId) { // $scope response will be either an order Id or null
          console.log(orderId);
          if (orderId) {
            // If $scope order id is not null, then compare with the one in localstorage
            if (localStorageService.get('id') && orderId === localStorageService.get('id')) {
              return true;
              // if same, then do nothing
            } else {
              localStorageService.set('id', orderId);
              return true;
              // Replace the id in the LS if $scope is different from the one stored there
            }
          } else {
            // Else if $scope order id is null, then create a new order and proceed as before
            if (localStorageService.get('id')) {
              //If id exits in LS link user to that order id
              return true;
            } else {
              //else if id does not create and order and use that id
              return orderService.createOrder();
            }
          }

        })
        .then(function(response) {
          console.log(response);
          if (typeof(response) === 'object') {
            if (response.data && response.data.objectId) {
              localStorageService.set('id', response.data.objectId);
            }
          }
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
          $scope.loading = false;
          $uibModalInstance.close('User Logged In');
        })
        .catch(function(error) {
          $scope.loading = false;
          $scope.error = error.data.message;
          console.error(error);
        });
    };


    $scope.checkUser = function() {
      if ($scope.user.phone.length === 10) {
        $scope.loading = true;

        customerService.checkUser($scope.user.phone)
          .then(function(response) {
            $scope.loading = false;

            console.log(response);
            console.log(response.data.code);
            if (response.data.code === 668 || response.data.code === 1001) {
              $uibModalInstance.dismiss();
              $scope.register($scope.user.phone, response.data.code);
            }
          }).catch(function(error) {
            $scope.loading = false;

            $scope.$emit('handleError', { error: error });
            console.error(error);
          });
      }
    };


    $scope.register = function(phone, code) {
      $uibModal.open({
        templateUrl: '/views/registermodal.html',
        size: 'sm',
        controller: 'RegistermodalCtrl',
        ControllerAs: 'register',
        resolve: {
          phone: function() {
            return phone;
          },
          code: function() {
            return code;
          }
        }
      });
    };

    $scope.cancel = function() {
      $uibModalInstance.close('cancel');
    };


    $scope.getUserOrders = function() {
      var deferred = $q.defer();
      console.log($scope.userId);
      orderService.getOrders(0, 1, $scope.userId, 'createdAt', 'initiated') // Include the state param to make sure only initiated orders are retrieved
        .then(function(response) {
          console.log(response.data);
          // The response is from the server, it can have two possible responses
          if (response.data && response.data.length) {
            // Resolve the final value of the order id and return the promise
            deferred.resolve(response.data[0].id);
          } else {
            // Else (if the response has an empty array, which means for $scope user no orders exist on the server)
            // resolve null
            deferred.resolve(null);
          }

        }).catch(function(error) {
          $scope.$emit('handleError', { error: error });

          console.error(error);
          deferred.reject(error.data);
        });
      return deferred.promise;
    };

    $scope.reset = function() {
      $uibModalInstance.close('open-reset');
    };
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
  .controller('MainCtrl', ["$aside", "$state", "$scope", "$uibModal", "localStorageService", "$http", "customerService", function($aside, $state, $scope, $uibModal, localStorageService, $http, customerService) {
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
    $scope.$on('totalQuantity', function(totalQuantity) {
      console.log(totalQuantity.targetScope.totalQuantity);
      vm.total = totalQuantity.targetScope.totalQuantity;
      vm.cartChecker = true;
    });

    // Listening for any error
    $scope.$on('handleError', function(event, args) {
      vm.handleError(args.error, args.title);
    });

    //Listening for log out
    $scope.$on('add', function() {
      vm.total++;
    });

    /*=====  End of Events & Listeners  ======*/

    /**
     * Function to open the login modal
     * @return {void} 
     */
    this.open = function() {
      $uibModal.open({
        templateUrl: '/views/loginmodal.html',
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
        templateUrl: '/views/aside.html',
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
        templateUrl: '/views/errorModal.html',
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
        templateUrl: '/views/changemodal.html',
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
  }]);

'use strict';
angular.module('chocoholicsApp')
  .controller('PasswordchangeCtrl', ["$state", "$stateParams", "customerService", "loginService", "$scope", function($state, $stateParams, customerService, loginService, $scope) {

    var vm = this;

    this.checkValidRequest = function() {
      loginService
        .checkTempPassword($stateParams.id, $stateParams.pass).then(function(response) {
          console.log(response);
          if (response.data.success) {
            vm.showForm = true;
          }
        })
        .catch(function(error) {
          console.error(error);
          vm.error = error.data.message;
        });
    };

    this.updateProfile = function() {
      vm.loading = true;
      customerService
        .updateProfile($stateParams.id, vm.password)
        .then(function(response) {
          console.log(response);
          $scope.$emit('handleError', { error: 'Password Changed!', title: 'Hooray' });
          $state.go('main.home');
      vm.loading = false;

        })
        .catch(function(error) {
          console.error(error);
          vm.error = error.data.message;
      vm.loading = false;
        });
    };

    this.pre = function() {
      vm.showForm = false;
      vm.checkValidRequest();
    };

    this.pre();

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
  .controller('ProductCtrl', ["$scope", "$stateParams", "productService", "orderService", "localStorageService", function($scope, $stateParams, productService, orderService, localStorageService) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    var vm = this;

    // for cart counter
    $scope.$watch('totalQuantity', function(newValue) {
      $scope.$emit('totalQuantity', newValue);
    });

    this.loadProduct = function(id) {
      productService.getProduct(id)
        .then(function(response) {
          vm.product = response.data;
          if (vm.product.images && vm.product.images.length) {
            vm.loadImages(vm.product.images);
          }
        });
    };

    // function to get order items
    this.getItems = function(orderId) {
      orderService.getOrderItems(orderId)
        .then(function(response) {
          console.log('in get items');
          console.log(response.data.length);
          if (response.data.length === 0) {
            vm.product.quantity = 0;
          } else {
            _.each(response.data, function(orderItem) {
              $scope.totalQuantity = $scope.totalQuantity + orderItem.quantity;
              if (orderItem.itemId === vm.product.id) {
                vm.product.quantity = orderItem.quantity;
                vm.product.addedId = orderItem.id;
              } else {
                vm.product.quantity = 0;
              }
              console.log(vm.product);
            });
          }
          console.log(vm.product.quantity);
        }).catch(function(error) {
          $scope.$emit('handleError', { error: error });
          console.error(error);
        });
    };

    // FOR IMAGES
    this.loadImages = function(images) {
      angular.forEach(images, function(image) {
        productService
          .getImages(image.objectId)
          .then(function(image) {
            console.log(image);
            vm.images.push(image);
          }, function(error) {
            vm.$emit('error', { message: error });
          });
      });
    };

    this.addItem = function() {
      // on clicking add item
      vm.product.adding = true;
      var item = {
        itemId: vm.product.id,
        quantity: 1
      };
      var items = [];
      items.push(item);
      console.log(vm.product.quantity);
      // if item was already added and has quantity > 0
      if (vm.product.quantity !== 0) {
        vm.product.quantity++;
        orderService.updateOrderItem(vm.product.addedId, vm.product.quantity, null, null, null, vm.orderId)
          .then(function(response) {
            console.log(response);
            // vm.product.adding = false;
            console.log(vm.product.quantity);
            $scope.totalQuantity = $scope.totalQuantity + 1;
            vm.product.adding = false;
          }).catch(function(error) {
            $scope.$emit('handleError', { error: error });

            console.log(error);
            // vm.product.adding = false;
          });
      } else {
        //if Product quantity is 0 and was not added before
        orderService.addOrderItem(items)
          .then(function(response) {
            var orderItemId;
            // console.log(response.data);
            orderItemId = response.data;
            console.log(orderItemId);
            vm.product.quantity++;
            vm.product.addedId = orderItemId;
            return orderService.linkOrder(vm.orderId, orderItemId);
          })
          .then(function(response) {
            console.log(response);
            $scope.totalQuantity = $scope.totalQuantity + 1;
            vm.product.adding = false;
          })
          .catch(function(error) {
            $scope.$emit('handleError', { error: error });

            console.error(error);
            vm.product.adding = false;
          });
      }
    };

    this.addItemLoggedOut = function() {
      // on clicking add item
      vm.product.adding = true;
      var item = {
        itemId: vm.product.id,
        quantity: 1
      };
      var items = [];
      items.push(item);
      console.log(vm.product);
      if (vm.orderId) {
        if (vm.product.quantity !== 0) {
          vm.product.quantity++;
          orderService.updateOrderItem(vm.product.addedId, vm.product.quantity, null, null, null, vm.orderId)
            .then(function(response) {
              console.log(response);
              // vm.product.adding = false;
              console.log(vm.product.quantity);
              $scope.totalQuantity = $scope.totalQuantity + 1;
              vm.product.adding = false;
            }).catch(function(error) {
              $scope.$emit('handleError', { error: error });

              console.log(error);
              // vm.product.adding = false;
            });
        } else {
          //if Product quantity is 0 and was not added before
          orderService.addOrderItem(items)
            .then(function(response) {
              var orderItemId;
              // console.log(response.data);
              orderItemId = response.data;
              console.log(orderItemId);
              vm.product.quantity++;
              vm.product.addedId = orderItemId;
              return orderService.linkOrder(vm.orderId, orderItemId);
            })
            .then(function(response) {
              console.log(response);
              $scope.totalQuantity = $scope.totalQuantity + 1;
              vm.product.adding = false;
            })
            .catch(function(error) {
              $scope.$emit('handleError', { error: error });

              console.error(error);
              vm.product.adding = false;
            });
        }
      } else {
        orderService.createOrder()
          .then(function(response) {
            vm.product.quantity = 1;
            vm.orderId = response.data.objectId;
            localStorageService.set('id', vm.orderId);
            return orderService.addOrderItem(items);
          }).then(function(response) {
            var orderItemId;
            orderItemId = response.data;
            vm.product.addedId = orderItemId;
            return orderService.linkOrder(vm.orderId, orderItemId);
          })
          .then(function(response) {
            console.log(response);
            console.log(vm.product.quantity);
            $scope.totalQuantity = $scope.totalQuantity + 1;
            $scope.totalQuantity = $scope.totalQuantity + 1;
            vm.product.adding = false;
            // localStorageService.set('total',vm.total);
          })
          .catch(function(error) {
            $scope.$emit('handleError', { error: error });

            console.error(error);
            vm.product.adding = false;
          });
      }
    };

    this.pre = function() {

      vm.imageOptions = {
        nolazy: true,
        background: true,
        imgAttrs: [{
          class: 'img-responsive animated fadeIn'
        }]
      };

      vm.product = {};
      vm.images = [];
      vm.id = $stateParams.id;
      vm.checker = false;
      $scope.totalQuantity = 0;
      // for stating page from top
      $(document).ready(function() {
        $(vm).scrollTop(0);
      });
      // to check login
      if (localStorageService.get('name')) {
        vm.checker = true;
      }
      // to check and set order id
      if (localStorageService.get('id')) {
        vm.orderId = localStorageService.get('id');
      }

      vm.loadProduct($stateParams.id);
      if (vm.orderId) {
        vm.getItems(vm.orderId);
      }
    };

    this.pre();


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
  .controller('RegistermodalCtrl', ["$scope", "$state", "$uibModalInstance", "phone", "customerService", "code", "localStorageService", function($scope, $state, $uibModalInstance, phone, customerService, code, localStorageService) {
    $scope.user = {};
    if (phone) {
      $scope.user.phone = phone;
    }
    $scope.register = function() {
      $scope.loading = true;

      localStorageService.remove('selectedAddress');
      customerService.registerUser($scope.user, code)
        .then(function() {
          $uibModalInstance.close();
          $scope.loading = false;
          $state.reload();
        })
        .catch(function(error) {
          $scope.$emit('handleError', { error: error });
          console.error(error);
          $scope.loading = false;
          $uibModalInstance.dismiss();
        });
    };
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
  .controller('ShopCtrl', ["$scope", "$rootScope", "productService", "orderService", "localStorageService", "accountService", function($scope, $rootScope, productService, orderService, localStorageService, accountService) {
    //variables
    var vm = this;
    var items = [];
    var orderItemId;
    var orderId;
    var totalQuantity;
    //variable definitions
    this.characters = 0;
    // to get div lenght
    this.length = 0;

    $scope.$watch('totalQuantity', function(newValue) {
      $scope.$emit('totalQuantity', newValue);
    });
    // to affix category
    $('#pillAffix').affix({
      offset: {
        top: 10,
      }
    });
    //to maintain width of category
    $(document).on('affix.bs.affix', '.content', function() {
      $(this).width($(this).width());
    });
    // to maintain position of category
    $('#pillAffix').affix('checkPosition');

    this.loadImages = function(images, index) {
      productService.getImages(images[0].objectId).then(function(image) {
          vm.products[index].image = image;
          console.log(vm.products[index]);
        })
        .catch(function(error) {
          console.error(error);
          $scope.$emit('handleError', { error: error });
        });
    };

    /**
     * Function to load the products on scroll and on page init
     * @param  {String} category Category of the product, should the user oclick on a category
     * @return {void}          
     */
    this.loadMore = function(category) {
      if (vm.busy) {
        return;
      }
      vm.busy = true;
      productService.getProducts(vm.counter, 12, null, category)
        .then(function(response) {
          // console.log(response.data);
          angular.forEach(response.data, function(element, index) {
            element.quantity = 0;
            vm.products.push(element);
            if (element.images && element.images.length) {
              vm.loadImages(element.images, index);
            }
            vm.busy = false;
          });
          if (orderId) {
            return orderService.getOrderItems(orderId);
          }
        })
        .then(function(response) {
          if (response) {
            var items = response.data;
            _.each(items, function(item) {
              _.each(vm.products, function(product) {
                if (product.id === item.itemId) {
                  product.quantity = item.quantity;
                  product.addedId = item.id;
                  console.log('itemid' + product.addedId);
                  // FOR IMAGES
                  // vm.loadImages(vm.product.images);
                }
              });
            });
          }
          // console.log(vm.products);
        })
        .catch(function(error) {
          $scope.$emit('handleError', { error: error.data });
          console.error(error);
        });
      vm.counter++;
      // console.log('entering page number ' + vm.counter);
    };

    var modifyItem = function(index) {
      if (vm.products[index].quantity !== 0) {
        //  increment the item count
        vm.products[index].quantity++;
        orderService.updateOrderItem(vm.products[index].addedId, vm.products[index].quantity, null, null, null, orderId)
          .then(function(response) {
            console.log(response);
            console.log(vm.products[index].quantity);
            $scope.totalQuantity = $scope.totalQuantity + 1;
            localStorageService.set('total', vm.total);
            vm.products[index].adding = false;
          }).catch(function(error) {
            $scope.$emit('handleError', { error: error });
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
            $scope.$emit('handleError', { error: error });
            console.error(error);
            vm.products[index].adding = false;
          });
      }
    };

    /**
     * Function to add item to the cart
     * @param {Integer} index Index of the product in the list
     */
    this.addItem = function(index) {
      // For the loader animation and button disabling
      vm.products[index].adding = true;

      // By default add one qty of an item, with each press, in case the product is being added for the first time
      var item = {
        itemId: vm.products[index].id,
        quantity: 1
      };

      // Array of items to be added
      items = [];

      // pushed the item in the array created above
      items.push(item);

      // Modify the item props
      modifyItem(index);

    };

    /**
     * function to get the order items if an order exists
     * @param  {String} orderId Order ID stored in the localStorage
     * @return {void}         
     */
    this.getItems = function(orderId) {
      $scope.totalQuantity = 0;
      orderService.getOrderItems(orderId)
        .then(function(response) {
          //console.log(response);
          _.each(response.data, function(orderItem) {
            $scope.totalQuantity += orderItem.quantity;
            if (orderItem.quantity === 0) {
              vm.showQuantity = false;
            } else {
              vm.showQuantity = true;
            }
          });
          $scope.$emit('totalQuantity', totalQuantity);
        }).catch(function(error) {
          $scope.$emit('handleError', { error: error });
          console.log(error);
        });
    };


    /**
     * Function to add items when user is logged out
     * @param {Integer} index Index of the product in the list
     */
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
        modifyItem(index);
      } else {
        console.log('else no order id');
        orderService.createOrder()
          .then(function(response) {
            console.log('create order');
            vm.products[index].quantity = 1;
            orderId = response.data.objectId;
            localStorageService.set('id', orderId);
            return orderService.addOrderItem(items);
          }).then(function(response) {
            console.log('add order item');
            vm.products[index].quantity++;
            orderItemId = response.data;
            vm.products[index].addedId = orderItemId;
            return orderService.linkOrder(orderId, orderItemId);
          })
          .then(function(response) {
            console.log('link order');
            console.log(response);
            $scope.totalQuantity = $scope.totalQuantity + 1;
            vm.products[index].adding = false;
            // localStorageService.set('total',vm.total);
          })
          .catch(function(error) {
            $scope.$emit('handleError', { error: error });
            console.error(error);
            vm.products[index].adding = false;
          });
      }
    };


    this.showCategory = function(category) {
      vm.products = [];
      vm.counter = 0;
      vm.loadMore(category);
    };

    this.getCategory = function() {
      vm.categories = [];
      accountService.getCategories()
        .then(function(response) {
          console.log(response);
          _.each(response.data, function(element) {
            vm.categories.push(element);
          });
        })
        .catch(function(error) {
          $scope.$emit('handleError', { error: error });
          console.error(error);
        });
    };

    // Init the page by calling products and populating them
    this.pre = function() {

      vm.imageOptions = {
        nolazy: true,
        background: true,
        imgAttrs: [{
          class: 'img-responsive animated fadeIn'
        }]
      };

      $('#navPillDiv').width($('#categoryNav').width() * 5);
      //to set tabs as active for big devices

      vm.name = localStorageService.get('name');
      // To check if user logged in
      if (vm.name) {
        vm.loggedIn = true;
      } else {
        vm.loggedIn = false;
      }
      vm.counter = 0;
      vm.busy = false;
      vm.products = [];
      $scope.totalQuantity = 0;
      if (localStorageService.get('id')) {
        orderId = localStorageService.get('id');
      }

      vm.loadMore();
      vm.getCategory();

      if (orderId) {
        vm.getItems(orderId);
      }

    };


    this.pre();

  }]);

'use strict';

/**
 * @ngdoc directive
 * @name chocoholicsApp.directive:compareTo
 * @description
 * # compareTo
 */
angular.module('chocoholicsApp')
  .directive('compareTo', function() {
    return {
      require: 'ngModel',
      scope: {
        otherModelValue: '=compareTo'
      },
      link: function(scope, element, attrs, ngModel) {
        ngModel.$validators.compareTo = function(modelValue) {
          return modelValue === scope.otherModelValue;
        };

        scope.$watch('otherModelValue', function() {
          ngModel.$validate();
        });
      }
    };
  });

'use strict';
angular.module('chocoholicsApp')
  .service('accountService', ["ENV", "$http", "localStorageService", function(ENV, $http, localStorageService) {
    const ENDPOINT = '/account/';
    return {
      getTaxes: function() {
        return $http.get(ENV.serverURL + ENDPOINT + 'taxes/' + ENV.vendorKey + '?user=' + ENV.owner, {
          headers: {
            'x-access-token': localStorageService.get('token')
          }
        });
      },

      getPincodes: function() {
        return $http.get(ENV.serverURL + ENDPOINT + 'pincodes/' + ENV.vendorKey);
      },

      getCategories: function() {
        return $http.get(ENV.serverURL + ENDPOINT + 'categories/' + ENV.vendorId);
      }
    };
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
    var addressRoute = '/address';
    // Public API here
    // 
    function newRegistration(user) {
      return $http.post(ENV.serverURL + route + '/register/' + ENV.vendorKey, {
        phone: user.phone,
        password: user.password,
        brand: ENV.brand,
        email: user.email,
        name: user.name
      });
    }

    function updateUser(user) {
      return $http.post(ENV.serverURL + route + '/update/' + ENV.vendorKey, {
        phone: user.phone,
        password: user.password,
        brand: ENV.brand,
        email: user.email,
        name: user.name
      });
    }

    return {
      checkUser: function(phone) {
        return $http.get(ENV.serverURL + route + '/check/' + ENV.vendorKey + '?phone=' + phone);
      },
      registerUser: function(user, code) {
        var deferred = $q.defer();
        var promises = [];

        console.info(code);

        if (code === 1001) {
          // Update the user profile
          promises.push(updateUser(user));
        }

        if (code === 668) {
          // register the user
          promises.push(newRegistration(user));
        }

        $q
          .all(promises)
          .then(function() {
            return loginService.loginUser(user);
          })
          .then(function() {
            console.log('reached orderService');
            localStorageService.set('name', user.name);
            localStorageService.set('phone', user.phone);
            localStorageService.set('email', user.email);
            if (localStorageService.get('id')) {
              return true;
            } else {
              return orderService.createOrder();
            }
          })
          .then(function(response) {
            console.log(response);
            if (response === true) {
              var info = {
                orderId: localStorageService.get('id'),
                userId: localStorageService.get('userId'),
                style: ENV.style
              };
              return orderService.updateInfo(info);

            } else {
              return true;
            }
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

      updateProfile: function(id, password) {
        return $http.put(ENV.serverURL + route + '/updateProfile/' + ENV.vendorKey + '/' + id, { password: password, brand: ENV.brand }, { headers: { 'x-access-token': localStorageService.get('token') } });
      },

      addAddress: function(address, customerId) {
        return $http.post(ENV.serverURL + addressRoute + '/add/' + ENV.vendorKey, {
          newAddress: address,
          customerId: customerId
        });
      },
      updateAddress: function(addressId, newAddress) {
        return $http.put(ENV.serverURL + addressRoute + '/update/' + addressId, {
          newAddress: newAddress
        });
      },
      getAddresses: function(customerId) {
        return $http.get(ENV.serverURL + addressRoute + '/all/' + ENV.vendorKey + '/' + customerId, { headers: { 'x-access-token': localStorageService.get('token') } });
      },
      removeAddress: function(addressId) {
        return $http.delete(ENV.serverURL + addressRoute + '/delete/' + addressId);
      },
      createDummySession: function() {
        return $http.post(ENV.serverURL + '/auth/createSession', { id: 'dummy' });
      },
      changePin: function(pincode) {
        if (pincode && pincode.toString().length === 6) {
          var base = ENV.myGovURL + ENV.myGovAPI + '&filters[pincode]=' + pincode;
          return $http.get(base, { cache: false, 'cache-control': 'none', 'Access-Control-Allow-Origin': '*' });
        }
      },
      getEmail: function(phone) {
        return $http.get(ENV.serverURL + route + '/getdata/' + ENV.brand + '?phone=' + phone);
      }
    };
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
  .factory('loginService', ["$http", "$q", "ENV", "localStorageService", "$location", function($http, $q, ENV, localStorageService, $location) {
    // Service logic
    // ...
    const ENDPOINT = '/customer/';
    var route = '/auth';
    // Public API here
    return {
      loginUser: function(user) {
        var deferred = $q.defer();
        $http.post(ENV.serverURL + route + ENDPOINT + 'login/' + ENV.vendorKey, {
            phone: user.phone,
            password: user.password,
            brand: ENV.brand,
            type: ENV.type
          })
          .then(function(response) {
            console.log(response.data);
            localStorageService.set('userId', response.data.customer.objectId);
            localStorageService.set('token', response.data.token);
            // $http.defaults.headers.common['x-access-token'] = response.data.token;
            $http.defaults.headers.post['x-access-token'] = response.data.token;
            $http.defaults.headers.put['x-access-token'] = response.data.token;
            deferred.resolve(response);
          })
          .catch(function(error) {
            console.error(error);
            deferred.reject(error);
          });
        return deferred.promise;
      },

      checkTempPassword: function(customerId, tempPassword) {
        return $http.post(ENV.serverURL + route + ENDPOINT + 'verifyPass/' + customerId, {
          brand: ENV.brand,
          vendor: ENV.vendorKey,
          tempPassword: tempPassword
        });
      },

      forgotPassword: function(id, phone) {
        return $http.post(ENV.serverURL + route + ENDPOINT + 'forgot/' + phone, {
          brand: ENV.brand,
          vendor: ENV.vendorKey,
          id: id,
          resetLink: $location.protocol() + '://' + $location.host() + '/#!/main/passwordChange'
        });
      }
    };
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
  .factory('orderService', ["$q", "$http", "ENV", "commonService", "localStorageService", function($q, $http, ENV, commonService, localStorageService) {
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
          type: 'food & beverage',
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
        return $http.post(ENV.serverURL + ENV.payPath + '/generate', data, {
          headers: {
            'x-access-token': localStorageService.get('token')
          }
        });
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
        if (sort) {
          queryParams.sortBy = sort;
        }
        if (state) {
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
      updateCost: function(cost) {
        return $http.post(ENV.serverURL + ENDPOINT + 'updateCost', cost);
      }
    };
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
    .factory('productService', ["$http", "ENV", "$q", "commonService", function($http, ENV, $q, commonService) {
        // Service logic
        // ...
        var route = '/stock';
        // Public API here
        return {
            getProducts: function(skip, limit, sortBy, category) {
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

                queryParams.activeOnly = true;
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
    }]);