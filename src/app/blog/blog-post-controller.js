angular.module('baasic.blog')
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
                    console.log(error); // jshint ignore: line
                })
                .finally(function () {
                    $scope.$root.loader.resume();
                });

            $scope.deleteBlog = function deleteBlog() {
                /* global confirm */
                if (confirm('Are you sure you want to delete this post?')) {
                    $scope.$root.loader.suspend();
                    blogService.remove($scope.blog)
                        .success(function () {
                            $state.go('master.main.index');
                        })
                        .error(function (error) {
                            conosle.log(error); // jshint ignore: line
                        })
                        .finally(function () {
                            $scope.$root.loader.resume();
                        });
                }
            };

            $scope.editBlog = function editBlog() {
                $state.go('master.blog-edit', { slug: $scope.blog.slug });
            };
        }
    ]);