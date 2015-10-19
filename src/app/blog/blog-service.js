angular.module('baasic.blog')
    .service('baasicBlogService', ['baasicApiHttp', 'baasicArticleService', 'baasicArticleTagsService',
        function baasicBlogService(baasicApiHttp, baasicArticleService, baasicArticleTagsService) {
            'use strict';

            this.blogStatus = {
                draft: 1,
                published: 2,
                archived: 4
            };

            this.get = function get(id, options) {
                return baasicArticleService.get(id, options);
            };

            this.find = function find(options) {
                var findOptions;
                if (options) {
                    findOptions = angular.copy(options);
                } else {
                    findOptions = {};
                }

                var searchQuery = findOptions.searchQuery || '';
                var lowerQuery = searchQuery.toLowerCase();
                var whereIndex = lowerQuery.indexOf(' where ');

                if (whereIndex !== -1) {
                    whereIndex = whereIndex + 8;
                    searchQuery = searchQuery.substring(0, whereIndex) + 'isBlog = 1 AND (' + searchQuery.substring(whereIndex) + ')';
                } else {
                    searchQuery = 'WHERE isBlog = 1';
                }

                findOptions.searchQuery = searchQuery;

                return baasicArticleService.find(findOptions);
            };

            this.create = function create(blog) {
                var blogToCreate = angular.copy(blog);

                blogToCreate.isBlog = 1;

                return baasicArticleService.create(blogToCreate);
            };

            this.update = function update(blog) {
                return baasicArticleService.update(blog);
            };

            this.remove = function remove(blog) {
                return baasicArticleService.remove(blog);
            };

            this.unpublish = function unpublish(blog) {
                return baasicArticleService.publish(blog);
            };

            this.publish = function publish(blog, options) {
                return baasicArticleService.publish(blog, options);
            };

            this.next = function next(blogList) {
                var nextLink = blogList.links('next');
                if (nextLink) {
                    return baasicApiHttp.get(nextLink.href);
                }
            };

            this.previous = function previous(blogList) {
                var prevLink = blogList.links('previous');
                if (prevLink) {
                    return baasicApiHttp.get(prevLink.href);
                }
            };

            this.tags = {
                find: function find(options) {
                    return baasicArticleTagsService.find(options);
                }
            };
        }
    ]);