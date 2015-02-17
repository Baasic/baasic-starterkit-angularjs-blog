angular.module('baasic.blog')
    .service('baasicBlogService', ['baasicArticleService',
        function baasicBlogService(baasicArticleService) {
            'use strict';

            var blogTag = 'blog';

            this.get = function get(id, options) {
                return baasicArticleService.get(id, options);
            };

            this.find = function find(options) {
                var findOptions = angular.copy(options);
                if (findOptions.tags && findOptions.tags !== '') {
                    findOptions.tags += ',' + blogTag;
                } else {
                    findOptions.tags = blogTag;
                }
                return baasicArticleService.find(findOptions);
            };

            this.create = function create(blog) {
                return baasicArticleService.create(blog);
            };

            this.update = function update(blog) {
                return baasicArticleService.update(blog);
            };

            this.remove = function remove(id) {
                var blog = {
                    id: id
                };
                return baasicArticleService.remove(blog);
            };

            this.unpublish = function unpublish(id) {
                var blog = {
                    id: id
                };
                return baasicArticleService.publish(blog);
            };

            this.publish = function publish(id) {
                return baasicArticleService.publish(id);
            };
        }
    ]
);