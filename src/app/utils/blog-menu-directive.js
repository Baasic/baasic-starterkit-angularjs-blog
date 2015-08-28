(function(angular) {
    'use strict';
    angular.module('baasic.blog')
        .directive('blogMenu', function() {
         return {
            restrict: 'E',
            templateUrl: 'templates/utils/blog-menu.html',
            scope: '='
        };
    });
}(angular));