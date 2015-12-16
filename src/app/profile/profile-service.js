angular.module('baasic.blog')
    .service('baasicProfileService', ['baasicApiHttp', 'baasicUserProfileService',
        function baasicProfileService(baasicApiHttp, baasicUserProfileService) {
            'use strict';

            this.get = function get(id, options) {
                return baasicUserProfileService.get(id, options);
            };

            this.find = function find(options) {
                return baasicUserProfileService.find(options);
            };
        }
    ]);