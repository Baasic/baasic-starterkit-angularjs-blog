angular.module('baasic.blog')
    .directive('baasicBlogList', ['$parse',
        function baasicBlogList($parse) {
            'use strict';

            var pageSizeFn;

            return {
                restrict: 'AE',
                scope: true,
                compile: function (elem, attrs) {
                    if (attrs.pageSize) {
                        pageSizeFn = $parse(attrs.pageSize);
                    } else {
                        pageSizeFn = function () { return 10; };
                    }
                },
                controller: ['$scope', 'baasicBlogService',
                    function baasicBlogListCtrl($scope, blogService) {
                        $scope.hasBlogs = true;

                        blogService.find({
                            rpp: pageSizeFn($scope)
                        })
                        .success(function (blogList) {
                            $scope.blogList = blogList.items;

                            $scope.hasBlogs = blogList && blogList.count > 0;
                        })
                        .error(function (error) {
                        });
                    }
                ],
                templateUrl: 'templates/blog/blog-list.html'
            };
        }
    ]
    );