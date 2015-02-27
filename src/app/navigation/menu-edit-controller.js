angular.module('myApp')
    .controller('EditMenuCtrl', ['$scope', '$state', 'menuService', 'pageService',
        function EditMenuCtrl($scope, $state, menuService, pageService) {
            'use strict';

            var isNew = $state.params.id === undefined;

            if (!isNew) {
                menuService.get($state.params.id)
                    .success(function (menu) {
                        $scope.menu = menu;
                    })
                    .error(function (error) {
                    });
            } else {
                $scope.menu = {};
            }

            pageService.find({
                statuses: ['published'],
                fields: ['title']
            })
                .success(function (pageList) {
                    $scope.pages = pageList.item;
                })
                .error(function (error) {
                });

            $scope.addContainer = function addContainer(container) {
                var containerList = $scope.menu.containers || ($scope.menu.containers = []);

                containerList.push(container);
            };

            $scope.save = function save() {
                if ($scope.menuForm.$valid) {
                    var promise;
                    if (isNew) {
                        promise = menuService.create($scope.menu);
                    } else {
                        promise = menuService.update($scope.menu);
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