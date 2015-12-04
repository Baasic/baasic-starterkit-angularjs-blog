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
                            embed: 'replies,replies.user,user'
                        })
                            .success(function (comments) {
                                $scope.comments = comments;
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
                                $scope.$root.loader.suspend();

                            $scope.comments.isNew = true;


                            if ($scope.comments.isNew) {
                            baasicArticleService.comments.create({
                                articleId: $scope.articleId,
                                data: $scope.comments
                                });

                            } else {

                                baasicArticleService.comments.update({
                                    articleId: $scope.articleId
                                });
                            }
                        }

                    };

                        $scope.hasComments = true;
                        loadComments();
                        }




                ],
                templateUrl: 'templates/comments/template-comments.html'
                };
            }
        ]
    );