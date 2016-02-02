angular.module('baasic.blog')
	.controller('AccountActivationCtrl',['$scope', '$stateParams', 'baasicRegisterService',
		function AccountActivationController($scope, $stateParams, baasicRegisterService) {
			'use strict';

			var vm = {};
			$scope.vm = vm;

			vm.message = 'Activating your account, please wait.';
			(function(){
				if($stateParams.activationToken) {
					baasicRegisterService.activate({activationToken: $stateParams.activationToken})
						.success(function(){
							vm.message = 'You have successfully activated your account!';
						})
						.error(function (data, status) {
							vm.message = status + ': ' + data.message;
						});
				}
				else {
					vm.message = 'Activation token is required';
				}
			})();
		}
	]);