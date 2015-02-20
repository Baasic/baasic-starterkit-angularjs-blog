angular.module('baasic.blog')
    .service('baasicBlogService', ['baasicArticleService',
        function baasicBlogService(baasicArticleService) {
            'use strict';

            var blogTag = {
                tag: 'blog',
                slug: 'blog'
            };

            this.blogStatus = {
                draft: 1,
                published: 2,
                archived: 4
            };

            this.get = function get(id, options) {
                return baasicArticleService.get(id, options);
            };

            this.find = function find(options) {
                var findOptions = angular.copy(options);
                if (findOptions.tags && findOptions.tags !== '') {
                    findOptions.tags += ',' + blogTag.slug;
                } else {
                    findOptions.tags = blogTag.slug;
                }

                return baasicArticleService.find(findOptions);
            };

            this.create = function create(blog) {
                var blogToCreate = angular.copy(blog);

                if (!blogToCreate.tags) {
                    blogToCreate.tags = [];
                }

                blogToCreate.tags.push(blogTag);

                return baasicArticleService.create(blogToCreate);
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