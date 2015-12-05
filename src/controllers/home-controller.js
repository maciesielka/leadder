"use strict";

angular
    .module("leadder")
    .controller("HomeController", function(ParseService, $scope, $rootScope){
        var vm = this;
        vm.leaderboards = [];
        vm.pendingApprovals = [];

        // pending approvals
        var getPendingApprovals = function() {
            var promise = new Parse.Promise();

            vm.approvalsLoading = true;
            ParseService.getMyPendingApprovals().then(function(results) {
                vm.approvalsLoading = false;
                vm.pendingApprovals = results;
                $scope.$apply();
                promise.resolve(results);
            }, function(error) {
                vm.approvalsLoading = false;
                $scope.$apply();
                promise.reject(error);
            });

            return promise;
        };

        var respondToApproval = function(approval, response) {
            $rootScope.rootLoading = true;
            ParseService.respondToApproval(approval, response).then(function() {
                $rootScope.rootLoading = false;
                refreshData();
            }, function(error) {
                console.error(error);
            });
        };

        vm.approvalResponseAction = function(approval) {
            respondToApproval(approval, true);
        };

        vm.rejectResponseAction = function(approval) {
            respondToApproval(approval, false);
        };

        // leaderboards
        var getMyLeaderboards = function() {
            var promise = new Parse.Promise();
            ParseService.getMyLeaderboards().then(function(results) {
                vm.leaderboards = results;
                $scope.$apply();
                promise.resolve(results);
            }, function(error){
                promise.reject(error);
            });
            return promise;
        };

        var refreshData = function() {
            return getPendingApprovals().then(function() {
                return getMyLeaderboards();
            });
        };

        refreshData();

        vm.buttonTitle = "Leave";
        vm.leaveLeaderboard = function(leaderboard) {
            $rootScope.rootLoading = true;
            ParseService.removeSelfFromLeaderboard(leaderboard).then(function() {
                return refreshData();
            }).then(function() {
                $rootScope.rootLoading = false;
            }, function(error) {
                console.error(error);
                $rootScope.rootLoading = false;
            });
        };
    });
