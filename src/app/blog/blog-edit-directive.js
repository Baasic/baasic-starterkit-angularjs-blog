angular.module('baasic.blog')
    .directive('baasicBlogEdit', ['$parse',
        function baasicBlogList($parse) {
            'use strict';
            var onSaveFn,
                onCancelFn,
                blogFn;

            return {
                restrict: 'AE',
                scope: true,
                compile: function (elem, attrs) {
                    if (attrs.blog) {
                        blogFn = attrs.blog;
                    }
                    if (attrs.onSave) {
                        onSaveFn = $parse(attrs.onSave);
                    }

                    if (attrs.onCancel) {
                        onCancelFn = $parse(attrs.onCancel);
                    }
                },
                controller: ['$scope', '$q', 'baasicBlogService',
                    function baasicBlogEditCtrl($scope, $q, blogService) {
                        var isNew;
                        if (blogFn) {
                            $scope.$parent.$watch(blogFn, function (newValue) {
                                $scope.blog = newValue;
                            });

                            isNew = false;
                        } else {
                            isNew = true;
                        }

                        $scope.state = {
                            conentent: {
                                viewMode: 'markdown'
                            }
                        };

                        $scope.saveBlog = function saveBlog() {
                            if ($scope.blogPost.$valid) {
                                var promise;
                                if ($scope.isNew) {
                                    $scope.blog.status = blogService.blogStatus.published; // Publish blog
                                    promise = blogService.create($scope.blog);
                                } else {
                                    promise = blogService.update($scope.blog);
                                }

                                promise
                                    .success(function () {
                                        if (onSaveFn) {
                                            onSaveFn($scope.$parent);
                                        }
                                    })
                                    .error(function (error) {
                                        $scope.error = error.message;
                                    });
                            }
                        };

                        $scope.cancelEdit = function cancelEdit() {
                            if (onCancelFn) {
                                onCancelFn($scope.$parent);
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
                                searchBy: query
                            }).
                            success(function (tags) {
                                var displayTags = [{ text: 'jea' }];
                                tags.forEach(function (tag) {
                                    displayTags.push({
                                        text: tag.tag
                                    })
                                });
                                deferred.resolve(displayTags);
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