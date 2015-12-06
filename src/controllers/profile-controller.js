"use strict";

angular
    .module("leadder")
    .controller("ProfileController", function(user, profiles, matches) {
        var vm = this;

        vm.user = user,
        vm.profiles = profiles,
        vm.matches = matches;

        vm.numWins = matches.reduce(function(prev, curr, index, arr) {
            if ( !curr.get('player1') || !curr.get('player2')) return prev;
            if ( curr.get('player1').get('user') && curr.get('player2').get('user')) {
                var thisIteration = curr.get("player1").get("user").id === vm.user.id ? 1 : 0;
                return prev + thisIteration;
            }
            return prev;
        }, 0);

        vm.numLosses = matches.reduce(function(prev, curr, index, arr) {
            if ( !curr.get('player1') || !curr.get('player2')) return prev;
            if ( curr.get('player1').get('user') && curr.get('player2').get('user')) {
                var thisIteration = curr.get("player1").get("user").id === vm.user.id ? 0 : 1;
                return prev + thisIteration;
            }
            return prev;
        }, 0);
    });
