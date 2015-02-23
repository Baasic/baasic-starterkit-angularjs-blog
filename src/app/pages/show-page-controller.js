angular.module('myApp')
    .controller('ShowPageCtrl', ['$scope', '$state', 'pageService',
        function ShowPageCtrl($scope, $state, pageService) {
            'use strict';

            pageService.get($state.params.slug)
                .success(function (page) {
                    $scope.page = page;
                })
                .error(function (error) {
                    $scope.page = {
                        title: 'There was error loading page',
                        content: error.message
                    }
                });
        }
    ]);