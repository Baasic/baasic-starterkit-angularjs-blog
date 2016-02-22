angular.module('baasic.blog')
    .directive('baasicSocialLogin', [
        function baasicSocialLogin() {
            'use strict';

            return {
                restrict: 'AE',
                scope: '=',
                controller:  ['$scope', '$state', 'baasicLoginService', 'baasicAuthorizationService',
                    function($scope, $state, loginService, authService){

                        var vm = {};
                        $scope.vm = vm;
                        vm.message = '';

                        vm.user = {};
                        vm.user.options = ['session', 'sliding'];


                        (function(){
                        if(authService.getAccessToken()){
                            vm.isUserLoggedIn = true;
                        }
                        else{
                            vm.isUserLoggedIn = false;
                        }
                        })();

                        $scope.goHome = function goHome() {
                            $state.go('master.main.index');
                        };

                        vm.socialLogin = {};

                        // Local storage key.
                        var storageKey = 'socialData',
                            // Activation url used in case of providers which by default through their API don't return an e-mail address in the response. In this instance users must provide their own e-mail address manually and verify the account just like they are registering a new account.
                            activationUrl = $state.href('account-activation', {}, { absolute: true }) + '?activationToken={activationToken}',
                            // Url where the SN provider will return us
                                returnUrl = 'http://localhost:3000/login';
                            //twitter
                                //returnUrl = 'http://127.0.0.1:3000/login';

                        // Reads stored social login data in local storage
                        var getStoredSocialLoginData = function() {
                            var data = localStorage.getItem(storageKey);
                            if (data){
                                return JSON.parse(data);
                            }
                        };
                        // Sets social login data in local storage.
                        var storeSocialLoginData = function(data){
                            if (!data){
                                localStorage.setItem(storageKey, null);
                            } else {
                                localStorage.setItem(storageKey, JSON.stringify(data));
                            }
                        };

                        // Holds username and password. In case the user already exists in the system which is detected using social login provider e-mail the API will ask for an existing username and password of the account, this can be detected by response status codes. An alternative to this exists as the API supports as well "connecting" existing providers which is only available if the user is logged in the system. This scenario will be covered in a future blog post and an expanded example.
                        vm.socialLogin.model = {};
                        // Response data from the server is stored in local storage since the login process requires that a user leaves the site and be redirected to the social login provider website. There are various ways to implement this, this can also be handled by opening a separate window; an implementation which is done on dashboard.baasic.com.
                        vm.socialLogin.providerData = getStoredSocialLoginData();
                        // Indicates if login form should be hidden.
                        vm.socialLogin.inProgress = false;
                        vm.socialLogin.sendingData = false;
                        vm.socialLogin.startLogin = function(provider){
                            // This call will build us a provider login url which we can then use to redirect the user to an external website.
                            loginService.social.get(provider, returnUrl)
                                .success(function (data) {
                                    // We are remembering the response and provider and are storing some additional data in the local storage.
                                    data.provider = provider;
                                    data.activationUrl = activationUrl;
                                    storeSocialLoginData(data);
                                    window.location.href = data.redirectUri;
                                })
                                .error(function (data, status) {
                                    var text = 'An error has occurred while fetching social login parameters.';
                                    if (data.error){
                                        text = status + ': ' + data.error_description;
                                    }
                                    vm.socialLogin.notification = text;
                                });
                        };
                        vm.socialLogin.login = function(){
                            // Clone provider data and add email and password to the request if available
                            var data = angular.copy(vm.socialLogin.providerData);
                            if (vm.socialLogin.model.email){
                                data.email = vm.socialLogin.model.email;
                            }
                            if (vm.socialLogin.model.password){
                                data.password = vm.socialLogin.model.password;
                            }
                            if (vm.socialLogin.sendingData){
                                return;
                            }
                            vm.socialLogin.sendingData = true;

                            // We are now in the position to attempt to login the user, system will perform code exchange to obtain a token and will check if the user exists in the system.
                            loginService.social.post(data.provider, data)
                                .success(function (data) {
                                    vm.isUserLoggedIn = true;
                                    vm.message = 'Successful login';
                                    vm.socialLogin.inProgress = false;
                                    vm.socialLogin.showCredentials = false;
                                    vm.socialLogin.notification = 'Logged in, please wait.';

                                    authService.updateAccessToken(data);
                                    loginService.loadUserData()
                                        .success(function(data){
                                            authService.resetPermissions();
                                            authService.updateUser(data);
                                            $state.go('master.main.index');
                                    })
                                    .error(function(data, status){
                                        var text = 'Please verify account with link that we sent to your email.';
                                        if (data.error){
                                            text = status + ': ' + data.error_description;
                                        }
                                        vm.socialLogin.notification = text;

                                    });

                                })
                                .error(function (data, status) {
                                    var text = 'Could not login user into the system';
                                    if (data.error){
                                        text = status + ': ' + data.error_description;
                                        if (data.error === 'invalid_grant' || data.error === 'missing_email'){
                                            // Existing user detected in the system, possibly data provided without the user password as well so prompt the user to provide the email and password
                                            vm.socialLogin.showCredentials = true;
                                            text = 'Please enter your data to proceed';
                                        }
                                    }
                                    vm.socialLogin.notification = text;
                                }).finally(function(){
                                    vm.socialLogin.sendingData = false;
                                    storeSocialLoginData(null);
                                });
                        };
                        vm.socialLogin.cancel = function(){
                            // Cancel social login mode and clear provider data
                            vm.socialLogin.notification = '';
                            vm.socialLogin.showCredentials = false;
                            vm.socialLogin.inProgress = false;
                            vm.socialLogin.providerData = undefined;
                            storeSocialLoginData(null);
                        };

                        if (vm.socialLogin.providerData && !vm.isUserLoggedIn){
                            // If we have data stored in local storage this means that the user has been returned here via callback from the social login provider website so in order to lock the form we're parsing the response data and verifying that the required response codes are present.
                            var responseData = loginService.social.parseResponse(vm.socialLogin.providerData.provider, returnUrl);
                            if (responseData.code || responseData.oAuthToken){
                                vm.socialLogin.inProgress = true;
                                // Automatically we're also attempting to login
                                angular.extend(vm.socialLogin.providerData, responseData);
                                vm.socialLogin.login();
                            } else {
                                // The local storage data exists but we have not detected a valid redirect from the social login provider. So we do some garbage cleaning here and clear out the localstorage and indicate that social login is not in progress.
                                storeSocialLoginData();
                                vm.socialLogin.inProgress = false;
                            }
                        }
                    }
                ],
                templateUrl: 'templates/membership/template-social-login.html'
            };
        }
    ]);
