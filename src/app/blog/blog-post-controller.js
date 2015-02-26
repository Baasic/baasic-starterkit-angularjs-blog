angular.module('baasic.blog')
    .controller('BlogPostCtrl', ['$scope', '$state', 'baasicBlogService',
        function BlogPostCtrl($scope, $state, blogService) {
            'use strict';

            $scope.editTemplateUrl = 'templates/blog/new-blog-post.html';

            $scope.$on('$includeContentLoaded', function (evt) {
                $scope.form = evt.targetScope.blogPost;
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