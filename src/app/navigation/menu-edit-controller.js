angular.module('myApp')
    .controller('EditMenuCtrl', ['$scope', '$state', 'menuService', 'pageService',
        function EditMenuCtrl($scope, $state, menuService, pageService) {
            'use strict';

            function isItemInMenu(item) {
                function findInLevel(compareFunc, level) {
                    for (var i = 0, l = level.length; i < l; i++) {
                        var node = level[i];

                        if (compareFunc(node)) {
                            return {
                                collection: level,
                                index: i
                            };
                        } else if (node.items) {
                            var res = findInLevel(compareFunc, node.items);
                            if (res != null) {
                                return res;
                            }
                        }
                    }

                    return null;
                }

                var compareFunc;
                if (item.id) {
                    compareFunc = function (node) { return node.pageId == item.id; };
                }

                return findInLevel(compareFunc, $scope.menu.items);
            }

            var isNew = $state.params.id === undefined;

            if (!isNew) {
                menuService.get($state.params.id)
                    .success(function (menu) {
                        if (!menu.items) {
                            menu.items = [];
                        }

                        $scope.menu = menu;
                    })
                    .error(function (error) {
                    });
            } else {
                $scope.menu = {
                    items: []
                };
            }

            pageService.find({
                statuses: ['published'],
                fields: ['id', 'title']
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

            $scope.addPageToMenu = function addPageToMenu(page) {
                var items = $scope.menu.items;
                var res = isItemInMenu(page);

                if (res === null) {
                    items.push({
                        title: page.title,
                        pageId: page.id
                    });
                } else {
                    res.collection.splice(res.index, 1);
                }
            };
        }
    ]);