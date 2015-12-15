angular.module('baasic.blog')
    .directive('commentReplies', [
        function commentReplies() {
            'use strict';

            return {
                restrict: 'AE',
                scope: true,
                controller: ['$scope', '$state', '$stateParams', '$q', 'baasicBlogService','baasicArticleService',
                    function ($scope, $state, $stateParams, $q, blogService, baasicArticleService) {
                        function loadReplies() {
                        blogService.comments.replies.find($scope.articleId,  $scope.commentId, {
                            orderBy: 'dateUpdated',
                            orderDirection: 'desc',
                            pageNumber: 1
                        })
                            .success(function parseRepliesList(replies) {
                                var commentId = $scope.comment.id;
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
                                $scope.$root.loader.resume();
                            });
                        }

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
                            }
                        };
                    }
                ],
                templateUrl: 'templates/comments/template-replies.html'
                };
            }
        ]
    );