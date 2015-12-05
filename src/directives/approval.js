"use strict";

angular
    .module("leadder")
    .directive("approval", function() {
        return {
            restrict: "E",
            templateUrl: "/src/templates/directives/approval.html",
            scope: {
                approval: "=",
                approvalAction: "&",
                rejectAction: "&"
            },
            link: function($scope) {
                $scope.currentUser = function() {
                    return Parse.User.current();
                }
            }
        };
    });
