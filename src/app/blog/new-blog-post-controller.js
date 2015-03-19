angular.module('baasic.blog')
    .controller('NewBlogPostCtrl', ['$scope', '$state',
        function NewBlogPostCtrl($scope, $state) {
            'use strict';

            $scope.blogSaved = function blogSaved() {
                $state.go('master.index');
            };

            $scope.cancelEdit = function cancelEdit() {
                $state.go('master.index');
            };
        }
    ]);