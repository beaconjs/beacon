'use strict';

angular.module('webApp').factory('sync', function ($rootScope, $http, $location) {

    var baseUrl = $rootScope.appconfig.server;

    /**
     * -====== helper functions ======-
     */
    var http = function (_path, _data, _method, setHeader) {
        var url = baseUrl + _path;
        if (navigator.onLine) {
            var _headers = getHeaders();
            if (setHeader) _headers['Content-Type'] = 'application/json';
            var promise = $http({
                method: _method,
                url: url,
                data: _data,
                headers: _headers
            });
            promise.then(function (r) {}, function (response) {
                if (response.status === 401) {
                    $rootScope.loggedInUser = null;
                    $location.path("/login");
                }
            });

            return promise;
        }

        return {
                success: function(f) { return this; },
                error: function(f) { console.error("There was an error processing the request. Do you have an active internet connection?"); return this; }
            };
    };

    var getHeaders = function () {
        var config = {};
        config['timeout'] = 15000;
        return config;
    };

    var _get = function (path) {
        return http(path, null, 'GET');
    };

    var _put = function (path, data) {
        return http(path, data, 'PUT');
    };

    var _del = function (path, data) {
        return http(path, data, 'DELETE', true);
    };

    var _post = function (path, data) {
        return http(path, data, 'POST', true);
    };

    //Public APIs
    return {
        get: _get,
        put: _put,
        del: _del,
        post: _post
    };
});
