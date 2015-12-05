"use strict";

angular
    .module("leadder")
    .filter("round", function() {
        return function(input) {
            input = input || 0;
            return Math.round(input);
        };
    });
