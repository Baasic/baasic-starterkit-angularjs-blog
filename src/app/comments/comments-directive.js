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
                            embed: 'comments.replies, comments.replies, comments.replies.user, comments.user'
                        })
                            .success(function (comments) {
                                $scope.comments = comments;

                                  /*  $scope.pagerData = {
                                    currentPage: commentList.page,
                                    pageSize: commentList.recordsPerPage,
                                    totalRecords: commentList.totalRecords
                                };

                                $scope.commentList = commentList;

                                $scope.hasComments = commentList.totalRecords > 0;*/
                            })
                            .error(function (error) {
                                console.log(error); //jshint ignore: line
                            })
                            .finally(function () {
                                $scope.$root.loader.resume();
                            });
                        }

                        $scope.hasComments = true;

                        loadComments();
                    }
                ],
                templateUrl: 'templates/comments/template-comments.html'
                };
            }
        ]
    );