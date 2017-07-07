'use strict';
/**
 * @ngdoc function
 * @name chocoholicsApp.controller:CartCtrl
 * @description
 * # CartCtrl
 * Controller of the chocoholicsApp
 */
angular.module('chocoholicsApp')
    .controller('CartCtrl', function($log, $rootScope, $state, $uibModal, $scope, ENV, orderService, localStorageService, customerService, accountService) {
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
    });