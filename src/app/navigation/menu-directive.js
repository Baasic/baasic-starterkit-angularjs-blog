angular.module('myApp')
    .directive('baasicMenu', ['$compile', '$parse',
        function baasicLogin($compile, $parse) {
            'use strict';
            var menuName;
            var itemsFn;

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

                    if (attrs.items) {
                        itemsFn = $parse(attrs.items);
                    }

                    var contents = elem.contents().remove();
                    var compiledContents;
                    return {
                        post: function (scope, element) {
                            // Compile the contents
                            if (!compiledContents) {
                                compiledContents = $compile(contents);
                            }
                            // Re-add the compiled contents to the element
                            compiledContents(scope, function (clone) {
                                element.append(clone);
                            });
                        }
                    };
                },
                controller: ['$scope', 'menuService',
                    function menuCtrl($scope, menuService) {
                        if (menuName) {
                            menuService.find({
                                searchQuery: 'WHERE name = \'' + menuName + '\''
                            })
                                .success(function (menus) {
                                    if (menus.totalRecords > 0) {
                                        $scope.menu = menus.item[0].items;
                                    }
                                });
                        } else {
                            $scope.menu = itemsFn($scope);
                        }
                    }
                ],
                templateUrl: 'templates/navigation/menu-item.html'
            };
        }
    ]);