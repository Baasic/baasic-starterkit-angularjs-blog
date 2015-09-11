angular.module('baasic.blog')
    .controller('BlogPostEditCtrl', ['$scope', '$state', 'baasicBlogService',
        function BlogPostEditCtrl($scope, $state, blogService) {
            'use strict';

            if (!$scope.$root.user.isAuthenticated) {
                $state.go('login');
            }

            $scope.$root.loader.suspend();

            blogService.get($state.params.slug, {
                embed: 'tags'
            })
                .success(function (blog) {
                    $scope.blog = blog;
                })
                .error(function (error) {
                    conosle.log(error); // jshint ignore: line
                })
                .finally(function () {
                    $scope.$root.loader.resume();
                });

            $scope.backToDetails = function backToDetails() {
                $state.go('master.blog-detail', { slug: $scope.blog.slug });
            };
        }
    ]);