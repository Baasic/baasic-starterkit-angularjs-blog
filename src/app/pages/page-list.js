angular.module('myApp')
    .controller('PagesCtrl', ['$scope', '$state', 'pageService',
        function PagesCtrl($scope, $state, pageService) {
            'use strict';

            pageService.find({
                statuses: [pageService.pageStatus.draft, pageService.pageStatus.published],
                rpp: 10
            })
                .success(function (pageList) {
                    $scope.pageList = pageList;
                })
                .error(function (error) {
                });
        }
    ]);