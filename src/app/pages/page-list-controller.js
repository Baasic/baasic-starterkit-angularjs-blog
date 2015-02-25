angular.module('myApp')
    .controller('PagesCtrl', ['$scope', '$state', 'pageService',
        function PagesCtrl($scope, $state, pageService) {
            'use strict';

            var rpp = 10,
                pageGroup = 10;

            function fetchPages(pageNumber) {
                pageNumber = parseInt(pageNumber);
                if (isNaN(pageNumber)) {
                    if ($scope.pager) {
                        pageNumber = $scope.pager.currentPage;
                    } else {
                        pageNumber = 1;
                    }
                }

                pageService.find({
                    statuses: ['draft', 'published'],
                    page: pageNumber,
                    rpp: rpp
                })
                .success(function (pageList) {
                    $scope.pageList = pageList;

                    $scope.hasPages = pageList.totalRecords > 0;

                    $scope.pagerData = {
                        currentPage: pageList.page,
                        pageSize: rpp,
                        pageGroupSize: pageGroup,
                        totalRecords: pageList.totalRecords
                    };
                })
                .error(function (error) {
                });
            }

            fetchPages();

            $scope.hasPages = true;

            $scope.deletePage = function deletePage(page) {
                if (confirm('Are you sure you want to delete this page?')) {
                    pageService.remove(page)
                        .success(fetchPages)
                        .error(function (error) {
                        });
                }
            };

            $scope.togglePublish = function togglePublish(page) {
                var promise;
                if (page.status === pageService.pageStatus.published) {
                    promise = pageService.unpublish(page);
                } else {
                    promise = pageService.publish(page);
                }

                promise
                    .success(fetchPages)
                    .error(function (error) {
                    });
            };

            $scope.selectPage = function selectPage(pageNumber) {
                fetchPages(pageNumber);
            };

            $scope.previousPage = function previousPage() {
                pageService.previous($scope.pageList);
            };

            $scope.nextPage = function nextPage() {
                pageService.next($scope.pageList);
            };
        }
    ]);