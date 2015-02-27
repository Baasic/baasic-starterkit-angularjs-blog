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

            $scope.addContainer = function addContainer() {
                var containerList = $scope.menu.containers || ($scope.menu.containers = []);

                containerList.push($scope.newContainer);

                $scope.addingNewContainer = false;
            };

            $scope.toggleAddContainer = function toggleAddContainer() {
                $scope.newContainer = {};
                $scope.addingNewContainer = !$scope.addingNewContainer;
            };

            $scope.removeContainer = function removeContainer(container) {
                var containerList = $scope.menu.containers;

                var index = containerList.indexOf(container);
                if (index !== -1) {
                    containerList.splice(index, 1);
                }
            };

            $scope.addLink = function addLink() {
                var linkList = $scope.menu.links || ($scope.menu.links = []);

                linkList.push($scope.newLink);

                $scope.addingNewLink = false;
            };

            $scope.toggleAddLink = function toggleAddLink() {
                $scope.newLink = {};
                $scope.addingNewLink = !$scope.addingNewLink;
            };

            $scope.removeLink = function removeLink(link) {
                var linkList = $scope.menu.links;

                var index = linkList.indexOf(link);
                if (index !== -1) {
                    linkList.splice(index, 1);
                }
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