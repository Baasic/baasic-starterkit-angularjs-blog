angular.module('baasic.blog')
    .directive('loader', [
        function loader() {
            'use strict';

            var delay = 300,
                hideClass = 'ng-hide';

            return {
                restrict: 'A',
                scope: true,
                link: function (scope, elem, attrs) {
                    var name;

                    elem.addClass(hideClass);

                    if (attrs.loader) {
                        name = attrs.loader;
                    } else {
                        name = loader;
                    }

                    scope.$root[name] = {
                        suspend: function suspend() {
                            scope.timerId = setTimeout(function () {
                                elem.removeClass(hideClass);
                            }, delay);
                        },
                        resume: function resume() {
                            if (scope.timerId) {
                                clearTimeout(scope.timerId);
                                scope.timerId = null;
                            }
                            elem.addClass(hideClass);
                        }
                    };
                }
            };
        }
    ]
    );