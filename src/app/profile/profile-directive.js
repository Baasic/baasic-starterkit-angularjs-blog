angular.module('baasic.blog')
    .directive('baasicProfile', [
        function baasicProfile() {
            'use strict';

            return {
                restrict: 'AE',
                scope: {
                    authorId: '=authorId',
                    user: '=user'
                },
                controller: ['$scope', '$q', 'baasicUserProfileService',
                    function baasicFindProfile($scope, $q, profileService) {
                        $scope.authorId = '';

                        $scope.$watch('authorId', function() {
                            if($scope.authorId.length > 0) {
                                profileService.get($scope.authorId, {
                                })
                                    .success(function (profile) {
                                        $scope.profile = profile;
                                        console.log($scope.user.email);
                                    })
                                    .error(function (error) {
                                        console.log(error); // jshint ignore: line
                                    })
                                    .finally(function () {
                                    });
                            }
                        });
                    }

                ],
                templateUrl: 'templates/profile/template-profile.html'
            };
        }
    ]);