angular.module('baasic.blog')
    .controller('NewBlogPostCtrl', ['$scope', '$state', 'baasicBlogService', 'markdownConverter',
        function NewBlogPostCtrl($scope, $state, blogService, markdownConverter) {
            'use strict';

            $scope.state = {
                conentent: {
                    viewMode: 'markdown'
                }
            };

            $scope.saveBlog = function saveBlog() {
                if ($scope.blogPost.$valid) {
                    $scope.blog.status = blogService.blogStatus.published; // Publish blog
                    blogService.create($scope.blog)
                        .success(function () {
                            $state.go('master.index');
                        })
                        .error(function (error) {
                            $scope.error = error.message;
                        });
                }
            };

            $scope.cancelEdit = function cancelEdit() {
                $state.go('master.index');
            };

            $scope.getHtml = function getHtml(content) {
                return markdownConverter.makeHtml(content);
            }
        }
    ]);