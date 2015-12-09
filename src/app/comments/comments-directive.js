angular.module('baasic.blog')
    .directive('blogComments', [
        function blogComments() {
            'use strict';

            return {
                restrict: 'AE',
                scope: { articleId: '=' },
                controller: ['$scope', '$state', '$stateParams', '$q', 'baasicBlogService','baasicArticleService',
                    function ($scope, $state, $stateParams, $q, blogService, baasicArticleService) {
                        function loadComments() {

                        blogService.comments.find($state.params.slug, {
                            embed: 'replies,replies.user,user',
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

                        $scope.saveComments = function saveComments() {
                            if ($scope.commentsForm.$valid) {
                                $scope.comments.isNew = true;

                            if ($scope.comments.isNew) {
                                $scope.comments.articleId = $scope.articleId;
                                var options = {
                                    subscribeAuthor: false,
                                    commentUrl: 'http://test.com'
                                };
                            //$state.href("index.article.comments-preview", {}, { absolute: true }) + "{id}"
                                $scope.comments.options = options;
                                baasicArticleService.comments.create($scope.comments);
                                $scope.$root.loader.suspend();
                                $state.go('master.main.index');
                                } else {
                                    baasicArticleService.comments.update({
                                        articleId: $scope.articleId
                                    });
                                }
                            }
                        };

                        $scope.saveReplies = function saveReplies(comment) {
                            $scope.comment = comment;
                            $scope.replies = comment.replies;
                            $scope.commentId = $scope.comment.id;
                            $scope.articleComment = $scope.comment.replies.reply;

                            $scope.comment.replies.isNew = true;
                            if ($scope.comment.replies.isNew) {

                                var options = {
                                    subscribeAuthor: false,
                                    commentUrl: 'http://test.com'
                                };

                                $scope.comment.replies.options = options;
                                baasicArticleService.comments.replies.create($scope.articleId, {
                                    commentId: $scope.commentId,
                                    options: $scope.comment.replies.options,
                                    userId: $scope.comment.email,
                                    reply: $scope.articleComment,
                                    orderBy: 'dateUpdated',
                                    orderDirection: 'desc'
                                })
                                    .success(function () {
                                        $scope.$root.loader.suspend();
                                        $state.go('master.main.index');
                                    })
                                    .error(function (error) {
                                        console.log(error); //jshint ignore: line
                                    })
                                    .finally(function () {
                                    });
                                }
                            };
                            loadComments();
                                              }
                ],
                templateUrl: 'templates/comments/template-comments.html'
                };
            }
        ]
    );