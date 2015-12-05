"use strict";

angular
    .module("leadder")
    .directive("participant", function() {
        return {
            restrict: "E",
            templateUrl: "/src/templates/directives/participant.html",
            scope: {
                index: "=",
                participant: "="
            }
        };
    });
