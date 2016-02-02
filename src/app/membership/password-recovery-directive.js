angular.module('baasic.blog')
	.directive('baasicPasswordRecovery', [
		function baasicPasswordRecovery() {
		'use strict';
		
		
		return {
			restrict: 'AE',
			scope: false,
			controller: ['$scope', '$state', 'baasicPasswordRecoveryService', 'baasicRecaptchaService',
				function($scope, $state, passwordRecoveryService, recaptchaService) {
									
					var vm = {};
					$scope.vm = vm;
					vm.message = '';
					
					vm.recoveryData = {};
					vm.recoveryData.challengeIdentifier = '';
					vm.recoveryData.challengeResponse = '';
					vm.recoveryData.recoverUrl = $state.href('password-change', {}, { absolute: true }) + '?passwordRecoveryToken={passwordRecoveryToken}';
					
					vm.recoverPassword = function() {
						vm.recoveryData.challengeIdentifier = recaptchaService.challenge();
						vm.recoveryData.challengeResponse = recaptchaService.response();
						
						if(vm.recoveryData.challengeResponse === '') {
							vm.message = 'Captcha code is required';
							return;
						}
						
						passwordRecoveryService.requestReset(vm.recoveryData)
							.success(function() {
								vm.message = 'An email with a password change link has been sucessfully sent.';
							})
							.error(function(data, status){
								vm.message = status + ': ' + data.message;
							})
							.finally(function () {
								$scope.$root.loader.resume();
							});					
					};
				}
			],
			templateUrl: 'templates/membership/template-password-recovery.html'	
		};
		}
	]);