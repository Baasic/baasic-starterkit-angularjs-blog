angular.module('myApp')
    .controller('EditMenuCtrl', ['$scope', '$state', 'baasicDynamicResourceService',
        function EditMenuCtrl($scope, $state, dynamincService) {
            'use strict';

            var isNew = $state.params.id === undefined;

            if (!isNew) {
                pageService.get('menu', $state.params.id)
                    .success(function (menu) {
                        $scope.menu = menu;
                    })
                    .error(function (error) {
                    });
            }

            $scope.save = function save() {
                if ($scope.menuForm.$valid) {
                    var promise;
                    if (isNew) {
                        promise = dynamincService.create($scope.page);
                    } else {
                        promise = dynamincService.update($scope.page);
                    }

                    promise
                        .success(function () {
                            $state.go('master.menu-list');
                        })
                        .error(function (error) {
                        });
                }
            };
        }
    ]);