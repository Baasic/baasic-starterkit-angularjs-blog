angular.module('myApp')
    .controller('RegisterUserCtrl', ['$scope', '$state', 'baasicUserRegisterService', 'baasicRecaptchaService',
        function RegisterUserCtrl($scope, $state, registerService, recaptchaService) {
            'use strict';

            $scope.registered = false;

            $scope.submitRegister = function submitRegister() {
                if ($scope.register.$valid) {
                    var challengeId = recaptchaService.challenge(),
                        challengeResponse = recaptchaService.response();
                    if (challengeResponse !== undefined && challengeResponse !== null && challengeResponse !== '') {
                        var req = $scope.registerRequest;
                        req.challengeIdentifier = challengeId;
                        req.challengeResponse = challengeResponse;
                        req.activationUrl = $state.href('master.activate-user', { activationCode: 'activationToken_placeholder' }, { absolute: true }).replace('activationToken_placeholder', '{activationToken}');

                        registerService.create(req)
                            .success(function () {
                                $scope.registered = true;
                            })
                            .error(function (error) {
                                $scope.registerError = error.message;
                            });
                    } else {
                        $scope.registerError = 'Need to complete recaptcha.';
                    }
                }
            };

            $scope.bailOut = function bailOut() {
                $state.go('master.index');
            };
        }
    ]);