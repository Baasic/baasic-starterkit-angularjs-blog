angular.module('baasic.blog')
    .directive('blogComments', [
        function blogComments() {
            'use strict';

            return {
                restrict: 'AE',
                scope: { articleId: '@articleid' },
                controller: ['$scope', '$state', '$stateParams', '$q', 'baasicBlogService',
                    function ($scope, $state, $stateParams, $q, blogService) {
                        function loadComments() {

                        blogService.comments.find($scope.articleId, {
                            embed: 'comments,comments.replies,comments.replies.user,comments.user'
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

                        blogService.comments.find({
                            articleId: $scope.articleId
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
                            });

                        $scope.hasComments = true;

                        loadComments();
                    }
                ],
                templateUrl: 'templates/comments/template-comments.html'
                };
            }
        ]
    );