angular.module('baasic.blog')
    .directive('blogComments', [
        function blogComments() {
            'use strict';

            return {
                restrict: 'AE',
                scope: {
                    articleId: '=',
                    blog: '='
                },
                controller: ['$scope', '$state', '$stateParams', '$q', 'baasicBlogService','baasicArticleService',
                    function ($scope, $state, $stateParams, $q, blogService, baasicArticleService) {
                        function loadComments() {
                        $scope.$root.loader.resume();
                        blogService.comments.find($state.params.slug, {
                            embed: 'user',
                            orderBy: 'dateUpdated',
                            orderDirection: 'desc',
                            page: $state.params.page || 1,
                            rpp: 10
                        })
                            .success(function parseCommentList(comments) {
                                $scope.comments = comments;

                                $scope.comments.pagerData = {
                                    currentPage: comments.page,
                                    pageSize: comments.recordsPerPage,
                                    totalRecords: comments.totalRecords
                                };

                                $scope.hasComments = comments.totalRecords > 0;
                            })
                            .error(function (error) {
                                console.log(error); //jshint ignore: line
                            })
                            .finally(function () {
                                $scope.$root.loader.resume();
                            });
                        }

                        loadComments();



                        $scope.saveComments = function saveComments(comments) {
                                $scope.$root.loader.resume();
                                $scope.comments = comments;
                                $scope.comments.articleId = $scope.articleId;
                                var options = {
                                    subscribeAuthor: false,
                                    commentUrl: $state.href('master.blog-detail', {}, { absolute: true }) + '{id}'
                                };
                                $scope.comments.options = options;
                                baasicArticleService.comments.create($scope.comments)
                                    .success(function() {
                                        $scope.comments = {};
                                    })
                                    .error(function(error) {
                                        console.log(error); //jshint ignore: line
                                    })
                                    .finally(function() {
                                        loadComments();
                                        $scope.$root.loader.suspend();
                                    });

                            };


                        }
                ],
                templateUrl: 'templates/comments/template-comments.html'
                };
            }
        ]
    );