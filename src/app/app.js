angular.module('baasic.blog', [
    'baasic.article'
]);

angular.module('myApp', [
  'ui.router',
  'baasic.security',
  'baasic.membership',
  'baasic.blog'
])
.config(['$locationProvider', '$urlRouterProvider', '$stateProvider', 'baasicAppProvider',
    function config($locationProvider, $urlRouterProvider, $stateProvider, baasicAppProvider) {
        'use strict';

        baasicAppProvider.create('delete-me', {
            apiRootUrl: 'api.baasic.local',
            apiVersion: 'beta'
        });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        $urlRouterProvider.when('', '/');

        $urlRouterProvider.otherwise(function ($injector) {
            var $state = $injector.get('$state');
            $state.go('404');
        });

        $urlRouterProvider.rule(function ($injector, $location) {
            var path = $location.path();

            // check to see if the path ends in '/'
            if (path[path.length - 1] === '/') {
                $location.replace().path(path.substring(0, path.length - 1));
            }
        });

        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: 'templates/main.html',
                controller: 'MainCtrl'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html'
            })
            .state('404', {
                templateUrl: 'templates/404.html'
            });
    }
])
.controller('MainCtrl', ['$scope', 'baasicLoginService', 'baasicAuthorizationService',
	function MainCtrl($scope, loginService, baasicAuthService) {
	    var userDetails = baasicAuthService.getUser();
	    $scope.$root.user = {
	        isAuthenticated: userDetails !== undefined && userDetails !== null
	    };

	    angular.extend($scope.$root.user, userDetails);

	    $scope.setEmptyUser = function setEmptyUser() {
	        $scope.$root.user = {
	            isAuthenticated: false
	        };
	    };
	}
]);