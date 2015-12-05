"use strict";

angular
    .module("leadder")
    .controller("NavController", function($scope, $location) {
        this.isActive = function(path) {
            return (path === $location.path());
        };

        var user = null, userObject = null;
    });
