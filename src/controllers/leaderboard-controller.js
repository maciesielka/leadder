"use strict";

angular
    .module("leadder")
    .controller("LeaderboardController", function(leaderboard, $scope, $rootScope, ParseService) {
        var vm = this;

        vm.leaderboard = leaderboard;
        vm.winner = leaderboard.participants[0];
        vm.loser = leaderboard.participants[1];

        vm.reportScore = function() {
            vm.toggleReportBody();
            $rootScope.rootLoading = true;

            vm.reporter = null;
            if(vm.winner.get("user").id === Parse.User.current().id) {
                vm.reporter = vm.winner;
            } else if (vm.loser.get("user").id === Parse.User.current().id) {
                vm.reporter = vm.loser;
            } else {
                $rootScope.rootLoading = false;
                $rootScope.rootErrorBody = "You can only report matches that you have played in";
                $rootScope.rootError = true;

                return;
            }

            ParseService.reportNewMatch(vm.winner, vm.loser, true, vm.reporter).then(function(match) {
                $rootScope.rootLoading = false;
                $rootScope.$apply();
            }, function(error) {
                $rootScope.rootLoading = false;

                console.log(error);
                $rootScope.rootErrorBody = error;
                $rootScope.rootError = true;
                $rootScope.$apply();
            });
        };

        // ui interaction
        vm.buttonTitle="Report Match";
        vm.limit = "NO_LIMIT";

        vm.showReportBody = false;
        vm.toggleReportBody = function() {
            vm.showReportBody = !vm.showReportBody;
        };
    });
