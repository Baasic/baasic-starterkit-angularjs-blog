angular.module('myBlog')
    .service('contactService', ['baasicApiHttp', 'baasicDynamicResourceService',
        function baasicBlogService(baasicApiHttp, dynamincService) {
            'use strict';

            var resourceName = 'contacts';

            this.get = function get(id, options) {
                return dynamincService.get(resourceName, id, options);
            };

            this.find = function find(options) {
                return dynamincService.find(resourceName, options);
            };

            this.create = function create(contactData) {
                return dynamincService.create(resourceName, contactData);
            };

            this.update = function update(contactData) {
                contactData.createDate = new Date();
                return dynamincService.update(contactData);
            };

            this.remove = function remove(contactData) {
                return dynamincService.remove(contactData);
            };

            this.next = function next(contactDataList) {
                var nextLink = contactDataList.links('next');
                if (nextLink) {
                    return baasicApiHttp.get(nextLink.href);
                }
            };

            this.previous = function previous(contactDataList) {
                var prevLink = contactDataList.links('previous');
                if (prevLink) {
                    return baasicApiHttp.get(prevLink.href);
                }
            };
        }
    ]
);