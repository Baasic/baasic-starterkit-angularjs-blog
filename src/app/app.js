angular.module('baasic.blog', [
    'baasic.article'
]);

angular.module('myBlog', [
  'ui.router',
  'ngAnimate',
  'btford.markdown',
  'ngTagsInput',
  'smoothScroll',
  'baasic.security',
  'baasic.membership',
  'baasic.dynamicResource',
  'baasic.blog'
])
.config(['$locationProvider', '$urlRouterProvider', '$stateProvider', 'baasicAppProvider', 'baasicAppConfigProvider',
    function config($locationProvider, $urlRouterProvider, $stateProvider, baasicAppProvider, baasicAppConfigProvider) {
        'use strict';

        baasicAppProvider.create(baasicAppConfigProvider.config.apiKey, {
            apiRootUrl: baasicAppConfigProvider.config.apiRootUrl,
            apiVersion: baasicAppConfigProvider.config.apiVersion
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
            .state('master.main', {
                abstract: true,
                templateUrl: 'templates/main.html',
                controller: 'MainCtrl'
            })
            .state('master.main.index', {
                url: '?{page}',
                templateUrl: 'templates/blog/blog-home.html'
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
            .state('master.blog-edit', {
                url: 'blog-post/edit/{slug}',
                templateUrl: 'templates/blog/blog-post-edit.html',
                controller: 'BlogPostEditCtrl'
            })
            .state('master.main.blog-search', {
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
.controller('MainCtrl', ['$scope', '$state', '$rootScope', '$browser', 'baasicBlogService',
    function MainCtrl($scope, $state, $rootScope, $browser, blogService) {
        'use strict';
        
        // http://stackoverflow.com/questions/8141718/javascript-need-to-do-a-right-trim
        var rightTrim = function (str, ch){
            if (!str){
                return '';
            }
            for (var i = str.length - 1; i >= 0; i--)
            {
                if (ch !== str.charAt(i))
                {
                    str = str.substring(0, i + 1);
                    break;
                }
            } 
            return str ? str : '';
        };       
        
        $rootScope.baseHref = rightTrim($browser.baseHref.href, ('/'));
        if ($rootScope.baseHref === '/') {
            $rootScope.baseHref = '';
        }
        
        blogService.tags.find({
            rpp: 10
        })
        .success(function (tagList) {
            $scope.tags = tagList.item;
        });

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
            $state.go('master.main.index');
        };
    }
])
.controller('SearchCtrl', ['$scope', '$state', function ($scope, $state) {
    'use strict';

    $scope.searchBlog = function searchBlog() {
            if ($scope.searchFor) {
                $state.go('master.main.blog-search', { search: $scope.searchFor });
            }
        };
}])
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