angular.module('myApp')
    .service('pageService', ['baasicApiHttp', 'baasicArticleService',
        function pageService(baasicApiHttp, baasicArticleService) {
            'use strict';

            var pageTag = {
                tag: 'starter-page',
                slug: 'starter-page'
            };

            this.pageStatus = {
                draft: 1,
                published: 2
            };

            this.get = function get(id, options) {
                return baasicArticleService.get(id, options);
            };

            this.find = function find(options) {
                var findOptions = angular.copy(options);
                if (findOptions.tags && findOptions.tags !== '') {
                    findOptions.tags += ',' + pageTag.slug;
                } else {
                    findOptions.tags = pageTag.slug;
                }

                return baasicArticleService.find(findOptions);
            };

            this.create = function create(page) {
                var pageToCreate = angular.copy(page);

                if (!pageToCreate.tags) {
                    pageToCreate.tags = [];
                }

                pageToCreate.tags.push(pageTag);

                return baasicArticleService.create(pageToCreate);
            };

            this.update = function update(page) {
                return baasicArticleService.update(page);
            };

            this.remove = function remove(page) {
                return baasicArticleService.remove(page);
            };

            this.unpublish = function unpublish(page) {
                return baasicArticleService.unpublish(page);
            };

            this.publish = function publish(page) {
                return baasicArticleService.publish(page);
            };

            this.next = function next(pageList) {
                var nextLink = pageList.links('next');
                if (nextLink) {
                    return baasicApiHttp.get(nextLink.href);
                }
            };

            this.previous = function previous(pageList) {
                var prevLink = pageList.links('previous');
                if (prevLink) {
                    return baasicApiHttp.get(prevLink.href);
                }
            };
        }
    ]
);