angular.module('myApp')
    .directive('baasicMenu', [
        function baasicLogin() {
            'use strict';
            var menuName;

            return {
                restrict: 'AE',
                scope: false,
                compile: function (elem, attrs) {
                    if (attrs.baasicMenu !== undefined &&
                        attrs.baasicMenu !== null &&
                        attrs.baasicMenu !== '') {
                        menuName = attrs.baasicMenu;
                    } else {
                        menuName = attrs.name;
                    }
                },
                controller: ['$scope', 'menuService',
                    function menuCtrl($scope, menuService) {
                        menuService.find({
                            searchQuery: 'WHERE name = \'' + menuName + '\''
                        })
                            .success(function (menus) {
                                if (menus.totalRecords > 0) {
                                    $scope.menu = menus.item[0].items;
                                }
                            });
                    }
                ]
            };
        }
    ]);