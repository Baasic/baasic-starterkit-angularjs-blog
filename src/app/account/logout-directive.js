angular.module('myApp')
    .directive('baasicLogout', ['$parse',
        function baasicLogout($parse) {
            'use strict';
            var fn;

            return {
                restrict: 'AE',
                scope: false,
                compile: function (elem, attrs) {
                    fn = $parse(attrs.onLogout);
                },
                controller: ['$scope', 'baasicLoginService', 'baasicAuthorizationService',
                    function baasicLogoutCtrl($scope, loginService, authService) {
                        $scope.logout = function logout() {
                            loginService.logout()
                                .finally(function () {
                                    authService.setUser(null);
                                    authService.updateToken(null);

                                    if (fn) {
                                        fn($scope);
                                    }
                                });
                        };
                    }
                ]
            };
        }
    ]);