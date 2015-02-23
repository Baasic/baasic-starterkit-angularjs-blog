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
                            var links = blogList.links();
                            $scope.pagerInfo = {
                                hasNext: links.hasOwnProperty('next'),
                                hasPrevious: links.hasOwnProperty('previous')
                            };
                            $scope.blogList = blogList;

                            $scope.hasBlogs = blogList.totalRecords > 0;
                        }

                        $scope.hasBlogs = true;

                        blogService.find({
                            statuses: ['published'],
                            rpp: pageSizeFn($scope)
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