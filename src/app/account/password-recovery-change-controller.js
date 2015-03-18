angular.module('myApp')
    .controller('PasswordRecoveryChangeCtrl', ["$scope", "$state", "baasicPasswordRecoveryService",
        function PasswordRecoveryChangeCtrl($scope, $state, pwdRecoveryService) {
            $scope.reset = function () {
                if ($scope.changePassword.$valid) {
                    $scope.changeRequest.passwordRecoveryToken = $state.params.token;

                    pwdRecoveryService.reset($scope.changeRequest)
                        .success(function () {
                            $scope.changeSuccess = 'You have successfully changed the password for your account.';
                        })
                        .error(function (error) {
                            $scope.changeError = error.message;
                        });
                }
            };
        }]);