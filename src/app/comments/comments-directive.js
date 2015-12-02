angular.module('baasic.blog')
    .directive('blogComments', [
        function blogComments() {
            'use strict';

            return {
                restrict: 'AE',
                scope: {
                    articleId:'='
                },
                controller: ['$scope', '$q', 'baasicBlogService',
                    function ($scope, $q, blogService) {
                        function loadComments() {
                            $scope.$root.loader.suspend();

                        blogService.get($state.params.slug, {
                            embed: 'comments,comments.replies,comments.replies.user,comments.user'
                        })
                            .success(function (comments) {
                                $scope.blog.comments = comments;
                            })
                            .error(function (error) {
                                console.log(error); //jshint ignore: line
                            })
                            .finally(function () {
                                $scope.$root.loader.resume();
                            });            }

                        blogService.comments.find({
                            articleId:,
                            userId: $scope.$root.user.id,
                            page: 1,
                            rpp: 10,
                            orderBy: 'publishDate',
                            orderDirection: 'desc'
                        })
                            .success(function parseCommentList(commentList) {
                                $scope.pagerData = {
                                    currentPage: commentList.page,
                                    pageSize: commentList.recordsPerPage,
                                    totalRecords: commentList.totalRecords
                                };

                                $scope.commentList = commentList;

                                $scope.hasComments = commentList.totalRecords > 0;
                            })
                            .error(function (error) {
                                console.log(error); // jshint ignore: line
                            })
                            .finally(function () {
                                $scope.$root.loader.resume();
                            });
                        }
                ],
                templateUrl: 'templates/comments/template-comments.html'
                };
            }
        ]
    );