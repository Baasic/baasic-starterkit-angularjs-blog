angular.module('baasic.blog')
    .directive('commentReplies', [
        function commentReplies() {
            'use strict';

            return {
                restrict: 'AE',
                scope: {
                    commentId: '=',
                    articleId: '='
                },
                controller: ['$scope', '$state', '$stateParams', '$q', 'baasicBlogService','baasicArticleService',
                    function ($scope, $state, $stateParams, $q, blogService, baasicArticleService) {
                        function loadReplies() {
                        blogService.comments.replies.find($scope.articleId,  $scope.commentId, {
                            embed: 'user',
                            orderBy: 'dateUpdated',
                            orderDirection: 'asc',
                            pageNumber: 1
                        })
                            .success(function parseRepliesList(replies) {
                                $scope.replies = replies.item;
                            })
                            .error(function (error) {
                                console.log(error); //jshint ignore: line
                            })
                            .finally(function () {
                                $scope.$root.loader.resume();
                            });
                        }

                        loadReplies();

                        $scope.saveReplies = function saveReplies(comment, reply) {
                            $scope.comment = comment;
                            $scope.reply = reply;
                            $scope.$root.loader.suspend();

                            var options = {
                                subscribeAuthor: false,
                                commentUrl: $state.href('master.blog-detail', {}, { absolute: true }) + '{id}'
                            };

                            baasicArticleService.comments.replies.create($scope.articleId, {
                                commentId: $scope.commentId,
                                options: options,
                                email: $scope.reply.email,
                                reply: $scope.reply.reply,
                                author: $scope.reply.author
                            })
                                .success(function () {
                                    $scope.reply = {};
                                    $scope.repliesForm.$setPristine(true);
                                    $scope.repliesForm.$setUntouched(true);
                                })
                                .error(function (error) {
                                    console.log(error); //jshint ignore: line
                                })
                                .finally(function () {
                                    loadReplies();
                                    $scope.$root.loader.resume();
                                });

                        };
                    }
                ],
                templateUrl: 'templates/comments/template-replies.html'
                };
            }
        ]
    );