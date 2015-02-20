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
                            statuses: ['published'],
                            rpp: pageSizeFn($scope)
                        })
                        .success(function (blogList) {
                            $scope.blogList = blogList.item;

                            $scope.hasBlogs = blogList && blogList.totalRecords > 0;
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