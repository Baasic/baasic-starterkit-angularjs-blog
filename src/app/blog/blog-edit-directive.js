angular.module('baasic.blog')
    .directive('baasicBlogEdit', ['$parse',
        function baasicBlogList($parse) {
            'use strict';

            return {
                restrict: 'AE',
                scope: true,
                compile: function () {
                    return {
                        pre: function (scope, elem, attrs) {
                            if (attrs.blog) {
                                scope.$parent.$watch(attrs.blog, function (newValue) {
                                    scope.blog = newValue;
                                    scope.isNew = newValue === undefined || newValue === null;                                 
                                });
                            }
                            if (attrs.onSave) {
                                scope.onSaveFn = $parse(attrs.onSave);
                            }

                            if (attrs.onCancel) {
                                scope.onCancelFn = $parse(attrs.onCancel);
                            }
                        }
                    };
                },
                controller: ['$scope', '$q', 'baasicBlogService', 'markdownConverter',
                    function baasicBlogEditCtrl($scope, $q, blogService, markdownConverter) {
                        function readingTime(text) {
                            var words = 0, start = 0, end = text.length - 1, i;

                            // fetch bounds
                            while (whitespace(text[start])) {
                                start++;
                            }
                            while (whitespace(text[end])) {
                                end--;
                            }

                            // there no words if bounds are equal
                            if (start === end) {
                                return null;
                            }

                            // calculates the number of words
                            for (i = start; i <= end;) {
                                for (; i <= end && !whitespace(text[i]) ; i++) {
                                    words++;
                                }
                                for (; i <= end && whitespace(text[i]) ; i++) {
                                }
                            }

                            // reading time stats
                            var minutes = words / 200;
                            var time = minutes * 60 * 1000;
                            var displayed = Math.ceil(minutes);

                            return {
                                text: displayed + ' min read',
                                time: time,
                                words: words
                            };
                        }

                        function whitespace(c) {
                            return (
                                (' ' === c) ||
                                ('\n' === c) ||
                                ('\t' === c)
                            );
                        }

                        $scope.isNew = true;

                        $scope.state = {
                            conentent: {
                                viewMode: 'markdown'
                            }
                        };

                        $scope.saveBlog = function saveBlog() {
                            if ($scope.blogPost.$valid) {
                                $scope.$root.loader.suspend();

                                $scope.blog.readingTime = readingTime($scope.blog.content);

                                var promise;
                                if ($scope.isNew) {
                                    $scope.blog.status = blogService.blogStatus.published; // Publish blog
                                    promise = blogService.create($scope.blog);
                                } else {
                                    promise = blogService.update($scope.blog);
                                }

                                promise
                                    .success(function () {
                                        if ($scope.onSaveFn) {
                                            $scope.onSaveFn($scope.$parent);
                                        }
                                    })
                                    .error(function (error) {
                                        $scope.error = error.message;
                                    })
                                    .finally(function () {
                                        $scope.$root.loader.resume();
                                    });
                            }
                        };

                        $scope.cancelEdit = function cancelEdit() {
                            if ($scope.onCancelFn) {
                                $scope.onCancelFn($scope.$parent);
                            }
                        };

                        $scope.getHtml = function getHtml(content) {
                            return markdownConverter.makeHtml(content);
                        };

                        $scope.setViewMode = function setViewMode(mode) {
                            $scope.state.conentent.viewMode = mode;
                        };

                        $scope.loadTags = function loadTags(query) {
                            var deferred = $q.defer();

                            blogService.tags.find({
                                search: query
                            })
                                .success(function (tags) {
                                    deferred.resolve(tags.item);
                                })
                                .error(function () {
                                    deferred.reject();
                                });

                            return deferred.promise;
                        };                                              
                    }
                ],
                templateUrl: 'templates/blog/blog-post-edit-form.html'
            };
        }
    ]
    );