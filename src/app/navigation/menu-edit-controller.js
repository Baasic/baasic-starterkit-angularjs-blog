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

            $scope.$watch('currentMenuItem.type', function (value) {
                $scope.isPage = value === menuService.itemTypes.page;
                $scope.isLink = value === menuService.itemTypes.link;
            });

            $scope.openItemForm = function openItemForm(container) {
                if (angular.isArray(container)) {
                    $scope.currentMenuItem = {
                        isNew: true,
                        type: menuService.itemTypes.container,
                        container: container || $scope.menu.items
                    };
                } else {
                }

                $scope.menuItemForm.$setPristine();
                $scope.itemFormVisible = true;
            };

            $scope.closeItemForm = function closeItemForm() {
                $scope.itemFormVisible = false;
            };

            $scope.saveItem = function saveItem() {
                var type = $scope.currentMenuItem.type;
                var menuItem = {
                    title: $scope.currentMenuItem.title,
                    type: type
                };

                if (type === menuService.itemTypes.container) {
                    menuItem.items = $scope.currentMenuItem.items || [];
                } else if (type === menuService.itemTypes.page) {
                    menuItem.pageId = $scope.currentMenuItem.pageId;
                } else if (type === menuService.itemTypes.link) {
                    menuItem.url = $scope.currentMenuItem.url;
                }

                if ($scope.currentMenuItem.isNew) {
                    $scope.currentMenuItem.container.push(menuItem);
                }

                $scope.closeItemForm();
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