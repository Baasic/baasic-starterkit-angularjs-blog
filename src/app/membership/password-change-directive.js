angular.module('baasic.blog')
	.directive('baasicPasswordChange', [
		function baasicPasswordChange() {
			'use strict';
			
			return {
				restrict: 'AE',
				scope: false,
				controller: ['$scope', '$stateParams', 'baasicPasswordRecoveryService',
					function($scope, $stateParams, passwordRecoveryService) {

					var vm= {};
					$scope.vm = vm;
					
					vm.resetData = {};
					vm.resetData.passwordRecoveryToken = $stateParams.passwordRecoveryToken;
					vm.resetData.newPassword = '';
					vm.resetData.confirmPassword = '';
					
					vm.changePassword = function() {
						if(vm.resetData.newPassword !== vm.resetData.confirmPassword) {
							vm.message = 'Password and Confirm Password must match';
							return;
						} 
						
						passwordRecoveryService.reset(vm.resetData)
							.success(function() {
								vm.message = 'You have successfully changed your password';
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
				templateUrl: 'templates/membership/template-password-change.html'
			};
		}
	]);