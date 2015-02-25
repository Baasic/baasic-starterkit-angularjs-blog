angular.module('myApp')
    .directive('pager', [
        function pager() {
            'use strict';

            var pagerDataExp,
                pagerName;

            return {
                restrict: 'AE',
                scope: true,
                controller: ['$scope', function ($scope) {
                    $scope.$watch(pagerDataExp, function (pagerData) {
                        if (pagerData) {
                            var currentPage = pagerData.currentPage || 1,
                            pageSize = pagerData.pageSize || 10,
                            pageGroupSize = pagerData.pageGroupSize || 10,
                            totalRecords = pagerData.totalRecords || 1,
                            numberOfPages = Math.floor(totalRecords / pageSize) + 1,
                            numberOfGroups = Math.floor(numberOfPages / pageGroupSize) + 1,
                            currentGroupIndex = pagerData.currentGroupIndex || Math.floor(currentPage / pageGroupSize) + 1,
                            groupCeil = currentGroupIndex * pageGroupSize,
                            pages = [];

                            for (var i = groupCeil - pageGroupSize + 1; i <= Math.min(numberOfPages, groupCeil) ; i++) {
                                pages.push(i);
                            }

                            $scope[pagerName] = {
                                hasPrevious: currentPage > 1,
                                hasNext: currentPage < numberOfPages,
                                hasPreviousGroup: currentGroupIndex > 1,
                                hasNextGroup: currentGroupIndex < numberOfGroups,
                                numberOfPages: numberOfPages,
                                currentPage: currentPage,
                                currentGroupIndex: currentGroupIndex,
                                totalRecords: totalRecords,
                                pages: pages
                            };
                        }
                    },
                    true);
                }],
                compile: function (elem, attr) {
                    pagerDataExp = attr.pagerData;
                    pagerName = attr.name || 'pager';
                }
            };
        }
    ]
    );