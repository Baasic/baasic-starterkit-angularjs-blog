angular.module('myBlog').provider('baasicAppConfig', function () {
    this.config = function () {
        return {
            apiKey: '<apiKey>',
            apiRootUrl: '<apiRootUrl>',
            apiVersion: '<apiVersion>'
        }
    };
});