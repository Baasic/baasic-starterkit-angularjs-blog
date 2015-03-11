angular.module('myApp')
    .controller('ActivateUserCtrl', ['$scope', '$state', 'baasicUserRegisterService',
        function ActivateUserCtrl($scope, $state, registerService) {
            'use strict';

            $scope.activated = false;

            registerService.activate({
                activationToken: $state.params.activationCode
            })
                .success(function () {
                    $scope.activated = true;
                })
                .error(function (error) {
                    $scope.error = error.message;
                });
        }
    ]);