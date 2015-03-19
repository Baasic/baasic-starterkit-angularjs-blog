angular.module('baasic.blog')
    .controller('BlogPostCtrl', ['$scope', '$state', 'baasicBlogService',
        function BlogPostCtrl($scope, $state, blogService) {
            'use strict';

            $scope.$on('$includeContentLoaded', function (evt) {
                $scope.form = evt.targetScope.blogPost;

                evt.targetScope.state = {
                    conentent: {
                        viewMode: 'markdown'
                    }
                };

                evt.targetScope.cancelEdit = function cancelEdit() {
                    $scope.isEdit = false;
                };
            });

            blogService.get($state.params.slug)
                .success(function (blog) {
                    $scope.blog = blog;
                })
                .error(function (error) {
                });

            $scope.deleteBlog = function deleteBlog() {
                if (confirm('Are you sure you want to delete this post?')) {
                    blogService.remove($scope.blog)
                        .success(function () {
                            $state.go('master.index');
                        })
                        .error(function (error) {
                        });
                }
            };

            $scope.editBlog = function editBlog() {
                $scope.isEdit = true;
            };

            $scope.saveBlog = function saveBlog() {
                if ($scope.form.$valid) {
                    blogService.update($scope.blog)
                        .success(function () {
                            $scope.isEdit = false;
                        })
                        .error(function (error) {
                        });
                }
            };
        }
    ]);