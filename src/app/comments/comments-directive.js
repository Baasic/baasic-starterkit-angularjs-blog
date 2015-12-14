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

                        function loadReplies() {

                        blogService.comments.replies.find($scope.articleId, $scope.commentId, {
                            pageNumber : 1,
                            orderBy: 'dateUpdated',
                            orderDirection: 'desc',
                        })
                            .success(function parseRepliesList(replies) {
                                var commentId = $scope.commentId;
                                var collection = $scope.comments.item;

                                angular.forEach(collection, function(value, i){
                                    if(value.id === commentId){
                                        collection[i].replies = replies.item;
                                    }
                                });
                            })
                            .error(function (error) {
                                console.log(error); //jshint ignore: line
                            })
                            .finally(function () {
                                $scope.reply = '';
                                $scope.$root.loader.resume();
                            });
                        }

                        $scope.resetCommentsForm = function resetCommentsForm(form) {
                            if (form) {
                                form.author.$setUntouched();
                                form.email.$setUntouched();
                                form.title.$setUntouched();
                                form.message.$setUntouched();
                                loadComments();
                            }
                        };

                        $scope.saveComments = function saveComments() {
                            if ($scope.commentsForm.$valid) {
                                $scope.$root.loader.resume();
                                $scope.comments.isNew = true;

                            if ($scope.comments.isNew) {
                                $scope.comments.articleId = $scope.articleId;
                                var options = {
                                    subscribeAuthor: false,
                                    commentUrl: $state.href('master.blog-detail', {}, { absolute: true }) + '{id}'
                                };
                            //
                                $scope.comments.options = options;
                                baasicArticleService.comments.create($scope.comments);
                                $scope.commentsForm.$setPristine(true);
                                $scope.commentsForm.$setUntouched(true);


                                } else {
                                    baasicArticleService.comments.update({
                                        articleId: $scope.articleId
                                    });
                                }
                                loadComments();
                                $scope.$root.loader.suspend();
                            }
                        };

                        $scope.saveReplies = function saveReplies(comment, reply) {
                            $scope.comment = comment;
                            $scope.reply = reply;
                            $scope.commentId = $scope.comment.id;
                            $scope.reply.isNew = true;
                            if ($scope.reply.isNew) {
                                $scope.$root.loader.suspend();

                                var options = {
                                    subscribeAuthor: false,
                                    commentUrl: 'http://test.com'
                                };

                                baasicArticleService.comments.replies.create($scope.articleId, {
                                    commentId: $scope.commentId,
                                    options: options,
                                    email: $scope.reply.email,
                                    reply: $scope.reply.reply,
                                    author: $scope.reply.author
                                })
                                    .success(function () {
                                        loadReplies();
                                        $scope.reply.author ="";
                                        $scope.reply.email ="";
                                        $scope.reply.reply ="";
                                    })
                                    .error(function (error) {
                                        console.log(error); //jshint ignore: line
                                    })
                                    .finally(function () {
                                        $scope.$root.loader.resume();
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