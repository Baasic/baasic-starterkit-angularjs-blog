angular.module('myBlog')
    .controller('ContactCtrl', ['$scope', '$state', 'contactService',
        function ContactCtrl($scope, $state, contactService) {
            'use strict';

            $scope.send = function send() {
                if ($scope.contactForm.$valid) {
                    contactService.create($scope.contact)
                        .success(function () {
                            $scope.error = null;
                            $scope.success = true;
                        })
                        .error(function (error) {
                            $scope.error = error.message;
                        });
                }
            };
        }
    ]);