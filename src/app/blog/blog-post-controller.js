﻿angular.module('baasic.blog')
    .controller('BlogPostCtrl', ['$scope', '$state', 'baasicBlogService',
        function BlogPostCtrl($scope, $state, blogService) {
            'use strict';

            $scope.$root.loader.suspend();

            blogService.get($state.params.slug, {
                embed: 'tags'
            })
                .success(function (blog) {
                    $scope.blog = blog;
                })
                .error(function (error) {
                })
                .finally(function () {
                    $scope.$root.loader.resume();
                });

            $scope.deleteBlog = function deleteBlog() {
                if (confirm('Are you sure you want to delete this post?')) {
                    $scope.$root.loader.suspend();
                    blogService.remove($scope.blog)
                        .success(function () {
                            $state.go('master.index');
                        })
                        .error(function (error) {
                        })
                        .finally(function () {
                            $scope.$root.loader.resume();
                        });
                }
            };

            $scope.editBlog = function editBlog() {
                $scope.isEdit = true;
            };

            $scope.blogSaved = function blogSaved() {
                $scope.isEdit = false;
            };

            $scope.cancelEdit = function cancelEdit() {
                $scope.isEdit = false;
            };
        }
    ]);