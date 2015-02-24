angular.module('myApp')
    .controller('EditPageCtrl', ['$scope', '$state', 'pageService',
        function EditPageCtrl($scope, $state, pageService) {
            'use strict';

            var isNew = $state.params.slug === undefined;

            if (!isNew) {
                pageService.get($state.params.slug)
                    .success(function (page) {
                        $scope.page = page;
                    })
                    .error(function (error) {
                    });
            }

            $scope.savePage = function savePage() {
                if ($scope.pageForm.$valid) {
                    var promise;
                    if (isNew) {
                        promise = pageService.create($scope.page);
                    } else {
                        promise = pageService.update($scope.page);
                    }

                    promise
                        .success(function () {
                            $state.go('page-list');
                        })
                        .error(function (error) {
                        });
                }
            };
        }
    ]);