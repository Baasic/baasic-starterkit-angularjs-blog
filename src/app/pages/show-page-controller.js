angular.module('myApp')
    .controller('ShowPageCtrl', ['$scope', '$sce', '$state', 'pageService',
        function ShowPageCtrl($scope, $sce, $state, pageService) {
            'use strict';

            pageService.get($state.params.slug)
                .success(function (page) {
                    $scope.content = $sce.trustAsHtml(page.content);
                })
                .error(function (error) {
                    $scope.page = {
                        title: 'There was error loading page',
                        content: error.message
                    };
                });
        }
    ]);