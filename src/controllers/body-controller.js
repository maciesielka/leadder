"use strict";

angular
    .module("leadder")
    .controller("BodyController", function($location, $rootScope){
        this.isActive = function(path) {
            return (path === $location.path());
        };

        $rootScope.rootLoading = false;
        $rootScope.setRootLoading = function(newValue) {
            $rootScope.rootLoading = newValue;
        };

        $rootScope.rootError = false;
        $rootScope.togglePopup = function() {
            $rootScope.rootError = !$rootScope.rootError;
        };

        $rootScope.currentUser = function() {
            return Parse.User.current();
        }
    });
