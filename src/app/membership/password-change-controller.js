angular.module('baasic.blog')
	.controller('PasswordChangeCtrl', ['$scope', '$stateParams', 'baasicPasswordRecoveryService',
		function($scope, $stateParams, baasicPasswordRecoveryService) {
				'use strict';
				
				var vm= {};
				$scope.vm = vm;
				
				vm.resetData = {};
				vm.resetData.passwordRecoveryToken = $stateParams.passwordRecoveryToken;
				vm.resetData.newPassword = '';
				vm.confirmPassword = '';
				
				vm.changePassword = function() {
					if(vm.resetData.newPassword !== vm.confirmPassword) {
						vm.message = 'Password and Confirm Password must match';
						return;
					}
					
					baasicPasswordRecoveryService.reset(vm.resetData)
						.success(function() {
							vm.message = 'You have successfullychanged your password';
						})
						.error(function(data, status){
							vm.message = status + ': ' + data.message;
						})
						.finally(function () {
							$scope.$root.loader.resume();
						});
				};
		}
	]);