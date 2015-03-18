angular.module('baasic.blog', [
    'baasic.article'
]);

angular.module('myBlog', [
  'ui.router',
  'baasic.security',
  'baasic.membership',
  'baasic.dynamicResource',
  'baasic.blog'
])
.config(['$locationProvider', '$urlRouterProvider', '$stateProvider', 'baasicAppProvider',
    function config($locationProvider, $urlRouterProvider, $stateProvider, baasicAppProvider) {
        'use strict';

        baasicAppProvider.create('delete-me', {
            apiRootUrl: 'baasic.buildserver',
            apiVersion: 'staging'
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
            .state('master', {
                abstract: true,
                url: '/',
                templateUrl: 'templates/master.html'
            })
            .state('master.index', {
                url: '',
                templateUrl: 'templates/main.html',
                controller: 'MainCtrl'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            })
            .state('master.register', {
                url: 'register',
                templateUrl: 'templates/account/register.html',
                controller: 'RegisterUserCtrl'
            })
            .state('master.activate-user', {
                url: 'activate-user/{activationCode}',
                templateUrl: 'templates/account/activate-user.html',
                controller: 'ActivateUserCtrl'
            })
            .state('master.forgot-password', {
                url: 'forgot-password',
                templateUrl: 'templates/account/password-recovery.html',
                controller: 'PasswordRecoveryCtrl'
            })
            .state('master.reset-password', {
                url: 'reset-password/{token}',
                templateUrl: 'templates/account/password-recovery-change.html',
                controller: 'PasswordRecoveryChangeCtrl'
            })
            .state('master.new-blog-post', {
                url: 'new-blog-post',
                templateUrl: 'templates/blog/new-blog-post.html',
                controller: 'NewBlogPostCtrl'
            })
            .state('master.blog-detail', {
                url: 'blog-post/{slug}',
                templateUrl: 'templates/blog/blog-post.html',
                controller: 'BlogPostCtrl'
            })
            .state('404', {
                templateUrl: 'templates/404.html'
            });
    }
])
.constant('recaptchaKey', '6LcmVwMTAAAAAKIBYc1dOrHBR9xZ8nDa-oTzidES')
.controller('MainCtrl', ['$scope', '$state', 'baasicLoginService', 'baasicAuthorizationService',
	function MainCtrl($scope, $state, loginService, baasicAuthService) {
	    'use strict';

	    var userDetails = baasicAuthService.getUser();
	    var user;
	    if (userDetails !== undefined && userDetails !== null) {
	        user = {
	            isAuthenticated: true,
	            isAdmin: userDetails.roles.indexOf('Administrators') !== -1
	        };

	        angular.extend($scope.$root.user, userDetails);
	    } else {
	        user = {
	            isAuthenticated: false
	        };
	    }

	    $scope.$root.user = user;

	    $scope.setEmptyUser = function setEmptyUser() {
	        $scope.$root.user = {
	            isAuthenticated: false
	        };
	    };

	    $scope.newBlogPost = function newBlogPost() {
	        $state.go('master.new-blog-post');
	    };
	}
])
.controller('LoginCtrl', ['$scope', '$state',
    function LoginCtrl($scope, $state) {
        'use strict';

        $scope.goHome = function goHome() {
            $state.go('master.index');
        };
    }
]);