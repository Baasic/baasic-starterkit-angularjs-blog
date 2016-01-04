angular.module('baasic.blog')
    .directive('profileDetail', [
        function profileDetail() {
            'use strict';

            return {
                restrict: 'AE',
                scope: {},
                controller: ['$scope', '$state', '$q', 'profileService',
                    function baasicProfileDetail($scope, $state, $q, profileService) {

                        profileService.get($state.params.authorId, {})
                            .success(function(data) {
                                $scope.data = data;
                            })
                            .error(function(error) {
                                console.log(error); // jshint ignore: line
                            })
                            .finally(function(response){
                                console.log(response);
                            });

                    }

                ],
                templateUrl: 'templates/profile/template-profile-detail.html'
            };
        }
    ]);