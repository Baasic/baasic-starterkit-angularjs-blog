angular.module('myApp')
    .controller('PagesCtrl', ['$scope', '$state', 'pageService',
        function PagesCtrl($scope, $state, pageService) {
            'use strict';

            var rpp = 10;

            function fetchPages() {
                pageService.find({
                    statuses: ["draft", "published"],
                    rpp: rpp
                })
                .success(function (pageList) {
                    $scope.pageList = pageList;

                    $scope.hasPages = pageList.totalRecords > 0;

                    var numberOfPages = Math.floor(pageList.totalRecords / rpp) + 1
                    $scope.pager = {
                        hasPrevious: pageList.page > 1,
                        hasNext: pageList.page < numberOfPages,
                        numberOfPages: numberOfPages,
                        currentPage: pageList.page
                    };
                })
                .error(function (error) {
                });
            };

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
        }
    ]);