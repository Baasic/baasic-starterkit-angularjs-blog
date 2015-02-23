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
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            })
            .state('new-blog-post', {
                url: '/new-blog-post',
                templateUrl: 'templates/blog/new-blog-post.html',
                controller: 'NewBlogPostCtrl'
            })
            .state('blog-detail', {
                url: '/blog-post/{slug}',
                templateUrl: 'templates/blog/blog-post.html',
                controller: 'BlogPostCtrl'
            })
            .state('show-page', {
                url: '/pages/{slug}',
                templateUrl: 'templates/page/show-page.html',
                controller: 'ShowPageCtrl'
            })
            .state('page-list', {
                url: '/page-management',
                templateUrl: 'templates/page/page-list.html',
                controller: 'PagesCtrl'
            })
            .state('page-edit', {
                url: '/page-management/edit/{slug}',
                templateUrl: 'templates/page/page-edit.html',
                controller: 'EditPageCtrl'
            })
            .state('new-page', {
                url: '/page-management/new',
                templateUrl: 'templates/page/page-edit.html',
                controller: 'EditPageCtrl'
            })
            .state('404', {
                templateUrl: 'templates/404.html'
            });
    }
])
.controller('MainCtrl', ['$scope', '$state', 'baasicLoginService', 'baasicAuthorizationService',
	function MainCtrl($scope, $state, loginService, baasicAuthService) {
	    'use strict';

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

	    $scope.newBlogPost = function newBlogPost() {
	        $state.go('new-blog-post');
	    };
	}
])
.controller('LoginCtrl', ['$scope', '$state',
    function LoginCtrl($scope, $state) {
        'use strict';

        $scope.goHome = function goHome() {
            $state.go('index');
        };
    }
]);