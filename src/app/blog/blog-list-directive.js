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
                        function parseBlogList(blogList) {
                            $scope.pagerData = {
                                currentPage: blogList.page,
                                pageSize: blogList.recordsPerPage,
                                totalRecords: blogList.totalRecords
                            };

                            $scope.blogList = blogList;

                            $scope.hasBlogs = blogList.totalRecords > 0;
                        }

                        $scope.hasBlogs = true;

                        blogService.find({
                            statuses: ['published'],
                            rpp: pageSizeFn($scope),
                            orderBy: 'dateUpdated',
                            orderDirection: 'desc'
                        })
                        .success(parseBlogList)
                        .error(function (error) {
                        });

                        $scope.prevPage = function prevPage() {
                            blogService.previous($scope.blogList)
                            .success(parseBlogList)
                            .error(function (error) {
                            });
                        };

                        $scope.nextPage = function nextPage() {
                            blogService.next($scope.blogList)
                            .success(parseBlogList)
                            .error(function (error) {
                            });
                        };
                    }
                ],
                templateUrl: 'templates/blog/blog-list.html'
            };
        }
    ]
    );