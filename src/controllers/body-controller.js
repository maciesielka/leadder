"use strict";

angular
    .module("leadder")
    .controller("BodyController", function($location, $rootScope){
        this.isActive = function(path) {
            return (path === $location.path());
        };

        $rootScope.rootError = false;
        $rootScope.togglePopup = function() {
            $rootScope.rootError = !$rootScope.rootError;
        };

        $rootScope.currentUser = function() {
            return Parse.User.current();
        }
    });
