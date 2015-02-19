angular.module('baasic.blog')
    .controller('NewBlogPostCtrl', ['$scope', '$state', 'baasicBlogService',
        function NewBlogPostCtrl($scope, $state, blogService) {
            $scope.saveBlog = function saveBlog() {
                if ($scope.blogPost.$valid) {
                    blogService.create($scope.blog)
                        .success(function () {
                            $state.go('index');
                        })
                        .error(function (error) {
                            $scope.error = error.message;
                        });
                }
            };
        }
    ]);