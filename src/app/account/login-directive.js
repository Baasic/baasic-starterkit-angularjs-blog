angular.module('myBlog')
    .directive('baasicLogin', ['$parse',
        function baasicLogin($parse) {
            'use strict';
            var fn;

            return {
                restrict: 'AE',
                scope: true,
                compile: function (elem, attrs) {
                    fn = $parse(attrs.onLogin);
                },
                controller: ['$scope', 'baasicLoginService', 'baasicAuthorizationService',
                    function baasicLoginCtrl($scope, loginService, authService) {
                        $scope.submitLogin = function submitLogin() {
                            if ($scope.login.$valid) {
                                loginService.login({
                                    userName: $scope.username,
                                    password: $scope.password,
                                })
                                .success(function (data) {
                                    authService.updateAccessToken(data);

                                    loginService.loadUserData()
                                        .success(function (data) {
                                            authService.resetPermissions();
                                            authService.updateUser(data);

                                            if (fn) {
                                                fn($scope);
                                            }
                                        })
                                        .error(function (data) {
                                            $scope.loginError = data.message;
                                        });
                                })
                                .error(function (data, status) {
                                    switch (status) {
                                        case 400:
                                            if (data.error === 'invalid_grant') {
                                                errorText = 'Invalid email, username or password';
                                            } else {
                                                errorText = data.error_description;
                                            }
                                            break;
                                        default:
                                            $scope.loginError = data.message;
                                            break;
                                    }
                                });
                            }
                        };
                    }
                ],
                templateUrl: 'templates/account/login.html'
            };
        }
    ]);