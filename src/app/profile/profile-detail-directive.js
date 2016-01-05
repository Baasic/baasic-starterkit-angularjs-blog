angular.module('baasic.blog')
    .directive('profileDetail', [
        function profileDetail() {
            'use strict';

            return {
                restrict: 'AE',
                scope: '=',
                controller: ['$scope', '$state', '$q', 'baasicUserProfileService',
                    function baasicProfileDetail($scope, $state, $q, baasicUserProfileService) {
                        function loadProfile() {
                        baasicUserProfileService.get($state.params.authorId, {

                        })
                            .success(function (data) {
                                $scope.profile = data;
                            })
                            .error(function (error) {
                                console.log (error); // jshint ignore: line
                            })
                            .finally(function (response){
                                console.log (response); // jshint ignore: line
                            });

                        }

                        loadProfile();

                    }

                ],
                templateUrl: 'templates/profile/template-profile-detail.html'
            };
        }
    ]);