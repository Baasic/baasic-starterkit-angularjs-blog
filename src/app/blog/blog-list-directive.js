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

                        $scope.$root.loader.suspend();

                        $scope.hasBlogs = true;

                        blogService.find({
                            statuses: ['published'],
                            rpp: pageSizeFn($scope),
                            orderBy: 'publishDate',
                            orderDirection: 'desc'
                        })
                        .success(parseBlogList)
                        .error(function (error) {
                            conosle.log(error); // jshint ignore: line
                        })
                        .finally(function () {
                            $scope.$root.loader.resume();
                        });

                        $scope.prevPage = function prevPage() {
                            $scope.$root.loader.suspend();

                            blogService.previous($scope.blogList)
                            .success(parseBlogList)
                            .error(function (error) {
                                conosle.log(error); // jshint ignore: line
                            })
                            .finally(function () {
                                $scope.$root.loader.resume();
                            });
                        };

                        $scope.nextPage = function nextPage() {
                            $scope.$root.loader.suspend();

                            blogService.next($scope.blogList)
                            .success(parseBlogList)
                            .error(function (error) {
                                conosle.log(error); // jshint ignore: line
                            })
                            .finally(function () {
                                $scope.$root.loader.resume();
                            });
                        };
                    }
                ],
                templateUrl: 'templates/blog/blog-list.html'
            };
        }
    ]
    );