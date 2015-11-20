angular.module('baasic.blog')
    .directive('blogComments', ['$parse',
        function blogComments($parse) {
            'use strict';

            return {
                restrict: 'AE',
                scope: true,
                templateUrl: 'templates/comments/template-comments.html'
                };
            }
        ]
    );