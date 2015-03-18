angular.module('myBlog')
    .controller('PasswordRecoveryCtrl', ['$scope', '$state', 'baasicRecaptchaService', 'baasicPasswordRecoveryService',
        function PasswordRecoveryCtrl($scope, $state, recaptchaService, pwdRecoveryService) {
            $scope.requestChange = function () {
                if ($scope.recovery.$valid) {
                    $scope.request.challengeIdentifier = recaptchaService.challenge();
                    $scope.request.challengeResponse = recaptchaService.response();
                    if ($scope.request.challengeResponse !== '') {
                        $scope.request.recoverUrl = $state.href('master.reset-password', { token: 'token-placeholder' }, { absolute: true }).replace('token-placeholder', '{passwordRecoveryToken}');

                        pwdRecoveryService.requestReset($scope.request)
                            .success(function () {
                                $scope.requestSuccess = 'E-mail containing a link to reset the password on your account has been sent.';
                            })
                            .error(function (error) {
                                $scope.requestError = error.message;
                            });
                    } else {
                        $scope.requestError = 'Captcha code is required.';
                    }
                }
            };

            $scope.back = function back() {
                $state.go('master.index');
            };
        }]);