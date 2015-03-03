angular.module('myApp')
    .controller('EditMenuCtrl', ['$scope', '$state', 'menuService', 'pageService',
        function EditMenuCtrl($scope, $state, menuService, pageService) {
            'use strict';

            function setItemInMenu(item, createItemFunc) {
                var items = $scope.menu.items;
                var res = $scope.isItemInMenu(item);

                if (res === null) {
                    var newItem = createItemFunc();
                    if (!Object.hasOwnProperty('items')) {
                        newItem.items = [];
                    }
                    items.push(newItem);
                } else {
                    res.collection.splice(res.index, 1);
                }
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
                fields: ['slug', 'title']
            })
                .success(function (pageList) {
                    $scope.pages = pageList.item;
                })
                .error(function (error) {
                });

            $scope.isItemInMenu = function isItemInMenu(item) {
                function findInLevel(findFunc, level) {
                    for (var i = 0, l = level.length; i < l; i++) {
                        var node = level[i];

                        if (findFunc(node)) {
                            return {
                                collection: level,
                                index: i
                            };
                        } else if (node.items) {
                            var res = findInLevel(findFunc, node.items);
                            if (res !== null) {
                                return res;
                            }
                        }
                    }

                    return null;
                }

                var findFunc;
                if (item.hasOwnProperty('slug')) {
                    findFunc = function (node) {
                        return node.pageId === item.slug;
                    };
                } else if (item.hasOwnProperty('url')) {
                    findFunc = function (node) {
                        return node.url !== undefined && node.title === item.title;
                    };
                } else {
                    findFunc = function (node) {
                        return node.isContainer && node.title === item.title;
                    }
                }

                return findInLevel(findFunc, $scope.menu.items);
            };

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
                var linkList = $scope.menu.linkList || ($scope.menu.linkList = []);

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
                setItemInMenu(
                    page,
                    function () {
                        return {
                            title: page.title,
                            pageId: page.slug
                        };
                    }
                );
            };

            $scope.addContainerToMenu = function addContainerToMenu(container) {
                setItemInMenu(
                    container,
                    function () {
                        return {
                            title: container.title,
                            isContainer: true
                        };
                    }
                );
            };

            $scope.addLinkToMenu = function addLinkToMenu(link) {
                setItemInMenu(
                    link,
                    function () {
                        return {
                            title: link.title,
                            url: link.url
                        };
                    }
                );
            };
        }
    ]);