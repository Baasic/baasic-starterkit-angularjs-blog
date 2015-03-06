angular.module('myApp')
    .controller('MenuListCtrl', ['$scope', '$state', 'menuService',
        function MenuListCtrl($scope, $state, menuService) {
            'use strict';

            var rpp = 10;

            function fetchMenus(pageNumber) {
                pageNumber = parseInt(pageNumber);
                if (isNaN(pageNumber)) {
                    if ($scope.pager) {
                        pageNumber = $scope.pager.currentPage;
                    } else {
                        pageNumber = 1;
                    }
                }

                menuService.find({
                    rpp: rpp,
                    page: pageNumber,
                    fields: ['id', 'name']
                })
                .success(function (menuList) {
                    $scope.menuList = menuList;

                    $scope.hasMenus = menuList.totalRecords > 0;

                    $scope.pagerData = {
                        currentPage: menuList.page,
                        pageSize: rpp,
                        totalRecords: menuList.totalRecords
                    };
                })
                .error(function (error) {
                });
            }

            fetchMenus();

            $scope.deleteMenu = function deleteMenu(menu) {
                menuService.remove(menu)
                    .success(fetchMenus)
                    .error(function (error) {
                    });
            };

            $scope.prevPage = function prevPage() {
                fetchMenus($scope.pagerData.currentPage - 1);
            };

            $scope.nextPage = function nextPage() {
                fetchMenus($scope.pagerData.currentPage + 1);
            };
        }
    ]
    );