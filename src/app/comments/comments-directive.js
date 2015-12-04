angular.module('baasic.blog')
    .directive('blogComments', [
        function blogComments() {
            'use strict';

            return {
                restrict: 'AE',
                scope: {},
                controller: ['$scope', '$state', '$stateParams', '$q', 'baasicBlogService',
                    function ($scope, $state, $stateParams, $q, blogService) {
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
//                                loadReplies();
                                $scope.$root.loader.resume();
                            });
                        }
/*
                        function loadReplies() {

                        blogService.comments.replies.find($state.params.slug, $state.params.slug, {

                        })
                            .success(function (replies) {
                                $scope.replies = replies;
                            })
                            .error(function (error) {
                                console.log(error); //jshint ignore: line
                            })
                            .finally(function () {
                                $scope.$root.loader.resume();
                            });
                        }
*/
                        $scope.hasComments = true;
                        loadComments();
                    }

                ],
                templateUrl: 'templates/comments/template-comments.html'
                };
            }
        ]
    );