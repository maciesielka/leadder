"use strict";

angular
    .module("leadder")
    .controller("ExploreController", function(ParseService, $scope, $rootScope) {
        var vm = this;
        ParseService.getAllOtherLeaderboards().then(function(results) {
            vm.leaderboards = results;
            $scope.$apply();
        }, function(error){
            console.error(error);
        });

        vm.buttonTitle = "Join";
        vm.joinLeaderboard = function(leaderboard) {
            $rootScope.rootLoading = true;
            ParseService.addSelfToLeaderboard(leaderboard).then(function(newProfile) {
                var list = [];
                for (var i = 0; i < vm.leaderboards.length; i++) {
                    var board = vm.leaderboards[i];
                    if (board.id !== leaderboard.id) {
                        list.push(board);
                    }
                }
                vm.leaderboards = list;
                $rootScope.rootLoading = false;
                $scope.$apply();
            }, function(error) {
                console.error(error);
                $rootScope.rootLoading = false;
            });
        };
    });
