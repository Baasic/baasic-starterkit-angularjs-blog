angular.module('myApp')
    .controller('EditMenuCtrl', ['$scope', '$state', 'menuService', 'pageService',
        function EditMenuCtrl($scope, $state, menuService, pageService) {
            'use strict';

            function setItemInMenu(item, createItemFunc) {
                var items = $scope.menu.items;
                var res = $scope.isItemInMenu(item);

                if (res === null) {
                    var newItem = createItemFunc();
                    if (newItem.type === 'container') {
                        newItem.items = newItem.items || [];
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
                        $scope.error = error.message;
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
                    console.log('Failed to load pages: ', error.message);
                });

            $scope.typeOptionItems = [];

            Object.keys(menuService.itemTypes).forEach(function (key, index, obj) {
                $scope.typeOptionItems.push({
                    value: obj[index],
                    text: key.charAt(0).toUpperCase() + key.substring(1)
                });
            });

            $scope.menuTreeOptions = {
                accept: function (sourceNodeScope, destNodesScope) {
                    if (destNodesScope.$nodeScope) {
                        var type = destNodesScope.$nodeScope.$modelValue.type
                        if (type && type !== menuService.itemTypes.container) {
                            return false;
                        }
                    }
                    return true;
                }
            };

            $scope.openAddNewItem = function openAddNewItem() {
                $scope.newMenuItem = {
                    type: menuService.itemTypes.container
                };
                $scope.addingNewItem = true;
            };

            $scope.closeAddNewItem = function closeAddNewItem() {
                $scope.addingNewItem = false;
            };

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
                        return node.type === 'page' && node.pageId === item.slug;
                    };
                } else if (item.hasOwnProperty('url')) {
                    findFunc = function (node) {
                        return node.type === 'link' && node.url === item.url && node.title === item.title;
                    };
                } else {
                    findFunc = function (node) {
                        return node.type === 'container' && node.title === item.title;
                    };
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
                            $scope.error = error.message;
                        });
                }
            };

            $scope.addPageToMenu = function addPageToMenu(page) {
                setItemInMenu(
                    page,
                    function () {
                        return {
                            title: page.title,
                            pageId: page.slug,
                            type: 'page'
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
                            type: 'container'
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
                            url: link.url,
                            type: 'link'
                        };
                    }
                );
            };

            $scope.toggleCollapse = function (scope) {
                scope.toggle();
            };

            $scope.removeItemFromMenu = function removeItemFromMenu(scope) {
                scope.remove();
            };
        }
    ]);