"use strict";

angular
    .module("leadder")
    .controller("AddLeaderboardController", function(ParseService, $location) {
        var vm = this;

        vm.name = null,
        vm.K = -1;

        var validate = function () {
            vm.error = null;
            if (vm.name === null || vm.name == "") {
                vm.error = "Please enter a valid name";
            } else if (vm.name.length < 6) {
                vm.error = "Leaderboard name should be at least 6 characters long";
            } else if (vm.K < 1 || vm.K > 200) {
                vm.error = "Please choose a valid Leaderboard volatility value";
            } else {
                vm.error = null;
            }

            return (vm.error === null);
        }

        vm.submit = function() {
            if (!validate()) {
                return false;
            }

            ParseService.addNewLeaderboard(vm.name, parseInt(vm.K)).then(function() {

            }, function(error) {
                console.log(error);
            });

            $location.path("/");
        }
    });
