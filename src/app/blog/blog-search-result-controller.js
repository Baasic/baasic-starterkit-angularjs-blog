angular.module('baasic.blog')
    .controller('BlogSearchResultsCtrl', ['$scope', '$state', 'baasicBlogService',
        function BlogSearchResultsCtrl($scope, $state, blogService) {
            'use strict';

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

            var options = {
                fields: ['title', 'slug', 'publishDate', 'excerpt'],
                statuses: ['published'],
                rpp: 10
            };

            if ($state.params.search) {
                options.search = $state.params.search;
            }

            if ($state.params.tags) {
                options.tags = $state.params.tags;
            }

            blogService.find(options)
                .success(parseBlogList)
                .error(function (error) {
                    conosle.log(error); // jshint ignore: line
                });

            $scope.prevPage = function prevPage() {
                blogService.previous($scope.blogList)
                .success(parseBlogList)
                .error(function (error) {
                    conosle.log(error); // jshint ignore: line
                });
            };

            $scope.nextPage = function nextPage() {
                blogService.next($scope.blogList)
                .success(parseBlogList)
                .error(function (error) {
                    conosle.log(error); // jshint ignore: line
                });
            };
        }
    ]);