angular.module('baasic.blog')
	.controller('RegisterCtrl', ['$scope','$state', 'baasicRegisterService', 'baasicRecaptchaService',
		function RegisterCtrl($scope, $state, baasicRegisterService, baasicRecaptchaService) {
			'use strict';
			
			var vm = {};
			$scope.vm = vm;
			
			vm.message = '';
			
			vm.user = {};
			vm.user.activationUrl = $state.href('account-activation', {}, {absolute: true}) + '?activationToken={activationToken}';
			vm.user.creationDate = new Date();
			vm.user.challengeIdentifier = '';
			vm.user.challengeResponse = '';
			
			vm.register = function() {
				if($scope.registrationForm.$valid) {
					vm.user.challengeIdentifier = baasicRecaptchaService.challenge();
					vm.user.challengeResponse = baasicRecaptchaService.response();
					
					if(vm.user.challengeResponse === '') {
						vm.message = 'Captcha code is required!';
						return;
					}
					
					baasicRegisterService.create(vm.user)
						.success(function() {
							vm.message = 'You have successfully registered, please check you email in order to finish registration process';
						})
						.error(function(data, status) {
							vm.message = status + ': ' + data.message;
							baasicRecaptchaService.reload();
						})
						.finally(function () {
							$scope.$root.loader.resume();
						});
				}
			};
		}
	]);