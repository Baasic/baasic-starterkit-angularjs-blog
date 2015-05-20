angular.module('baasic.blog')
    .controller('NewBlogPostCtrl', ['$scope', '$state',
        function NewBlogPostCtrl($scope, $state) {
            'use strict';

            if (!$scope.$root.user.isAuthenticated) {
                $state.go('login');
            }

            $scope.blogSaved = function blogSaved() {
                $state.go('master.main.index');
            };

            $scope.cancelEdit = function cancelEdit() {
                $state.go('master.main.index');
            };
        }
    ]);