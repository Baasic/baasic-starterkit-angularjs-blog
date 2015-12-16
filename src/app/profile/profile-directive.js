angular.module('baasic.blog')
    .directive('baasicProfile', [
        function baasicProfile() {
            'use strict';

            return {
                restrict: 'AE',
                scope: true,
                controller: ['$scope', '$q', 'baasicUserProfileService',
                    function baasicFindProfile($scope, $q, profileService) {
                        profileService.find({
                        })
                            .success(function (profiles) {
                                $scope.profiles = profiles.item;
                                angular.forEach($scope.profiles, function(value, i) {
                                    if (value.id === $scope.blog.authorId){
                                        $scope.profile = $scope.profiles[i];
                                    }
                                })
                                })



                            .error(function (error) {
                                console.log(error); // jshint ignore: line
                            })
                            .finally(function () {
                            });
                    }
                ],
                templateUrl: 'templates/profile/template-profile.html'
            };
        }
    ]

);


