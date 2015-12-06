"use strict";

angular
    .module("leadder")
    .controller("ProfileController", function(user, profiles, matches) {
        var vm = this;

        vm.user = user,
        vm.profiles = profiles,
        vm.matches = matches;

        vm.numWins = matches.reduce(function(prev, curr, index, arr) {
            if ( curr.get('player1').get('user').get('fullName') && curr.get('player2').get('user').get('fullName')) {
                return curr.get("player1").get("user").id === vm.user.id ? 1 : 0;
            }
            return 0;
        });
    });
