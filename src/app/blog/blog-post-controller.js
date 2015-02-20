angular.module('baasic.blog')
    .controller('BlogPostCtrl', ['$scope', '$state', 'baasicBlogService',
        function BlogPostCtrl($scope, $state, blogService) {
            'use strict';

            blogService.get($state.params.slug)
                .success(function (blog) {
                    $scope.blog = blog;
                })
                .error(function (error) {
                });
        }
    ]);