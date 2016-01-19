angular.module('baasic.blog')
    .service('profileService', ['baasicApiHttp', 'baasicUserProfileService',
        function profileService(baasicApiHttp, baasicUserProfileService) {
            'use strict';

            this.get = function get(id, options) {
                return baasicUserProfileService.get(id, options);
            };
        }
    ]);