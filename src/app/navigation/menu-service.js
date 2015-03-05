angular.module('myApp')
    .service('menuService', ['baasicApiHttp', 'baasicDynamicResourceService',
        function menuService(baasicApiHttp, dynamincService) {
            'use strict';

            var menuResourceName = 'menus';
            var menuItemTypes = {
                container: 'container',
                page: 'page',
                link: 'link'
            };

            this.itemTypes = menuItemTypes;

            this.get = function get(id, options) {
                return dynamincService.get(menuResourceName, id, options);
            };

            this.find = function find(options) {
                return dynamincService.find(menuResourceName, options);
            };

            this.create = function create(menu) {
                return dynamincService.create(menuResourceName, menu);
            };

            this.update = function update(menu) {
                return dynamincService.update(menu);
            };

            this.remove = function remove(menu) {
                return dynamincService.remove(menu);
            };

            this.next = function next(menuList) {
                var nextLink = menuList.links('next');
                if (nextLink) {
                    return baasicApiHttp.get(nextLink.href);
                }
            };

            this.previous = function previous(menuList) {
                var prevLink = menuList.links('previous');
                if (prevLink) {
                    return baasicApiHttp.get(prevLink.href);
                }
            };
        }
    ]
);