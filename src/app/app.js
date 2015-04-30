angular.module('baasic.blog', [
    'baasic.article'
]);

angular.module('myBlog', [
  'ui.router',
  'btford.markdown',
  'ngTagsInput',
  'baasic.security',
  'baasic.membership',
  'baasic.dynamicResource',
  'baasic.blog'
])
.config(['$locationProvider', '$urlRouterProvider', '$stateProvider', 'baasicAppProvider',
    function config($locationProvider, $urlRouterProvider, $stateProvider, baasicAppProvider) {
        'use strict';

        baasicAppProvider.create('starterkit-blog', {
            apiRootUrl: 'api.baasic.com',
            apiVersion: 'beta'
        });

        $locationProvider.html5Mode({
            enabled: true
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
            .state('master.blog-search', {
                url: 'blog-search?{search,tags}',
                templateUrl: 'templates/blog/blog-search-results.html',
                controller: 'BlogSearchResultsCtrl'
            })
            .state('404', {
                templateUrl: 'templates/404.html'
            });
    }
])
.constant('recaptchaKey', '6LcmVwMTAAAAAKIBYc1dOrHBR9xZ8nDa-oTzidES')
.controller('MainCtrl', ['$scope', '$state', 'baasicBlogService',
	function MainCtrl($scope, $state, blogService) {
	    'use strict';

	    blogService.tags.find({
	        rpp: 10
	    })
        .success(function (tagList) {
            $scope.tags = tagList.item;
        });

	    $scope.searchBlog = function searchBlog() {
	        if ($scope.searchFor) {
	            $state.go('master.blog-search', { search: $scope.searchFor });
	        }
	    };

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
])
.run(['$rootScope', '$window', 'baasicAuthorizationService',
    function moduleRun($rootScope, $window, baasicAuthService) {
        'use strict';

        var token = baasicAuthService.getAccessToken();
        var userDetails;
        if (token) {
            userDetails = baasicAuthService.getUser();
        }

        var user;
        if (userDetails !== undefined && userDetails !== null) {
            user = {
                isAuthenticated: true,
                isAdmin: userDetails.roles.indexOf('Administrators') !== -1
            };

            angular.extend(user, userDetails);
        } else {
            user = {
                isAuthenticated: false
            };
        }

        $rootScope.user = user;
    }
]);