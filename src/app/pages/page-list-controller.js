angular.module('myApp')
    .controller('PagesCtrl', ['$scope', '$state', 'pageService',
        function PagesCtrl($scope, $state, pageService) {
            'use strict';

            $scope.hasPages = true;

            pageService.find({
                statuses: ["draft", "published"],
                rpp: 10
            })
                .success(function (pageList) {
                    $scope.pageList = pageList;

                    $scope.hasPages = pageList.totalRecords > 0;
                })
                .error(function (error) {
                });
        }
    ]);