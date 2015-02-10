angular.module('myApp', [
  'ui.router'
])
.config(['$locationProvider', '$urlRouterProvider', '$stateProvider',
    function config($locationProvider, $urlRouterProvider, $stateProvider) {
        'use strict';

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
            .state('404', {
                templateUrl: 'templates/404/404.html'
            });
    }
])
.controller('MainCtrl', ['$scope',
	function MainCtrl($scope) {
	}
]);
