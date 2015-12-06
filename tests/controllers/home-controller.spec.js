"use strict";

describe("HomeController", function(){

    var $controller, controller, ParseService, $scope, rootScope;
    beforeEach(module("leadder"));
    beforeEach(inject(function($injector, $rootScope) {
        $scope = $rootScope.$new();
        $controller = $injector.get("$controller");
        var bodyController = $controller("BodyController");
        rootScope = $rootScope;
        ParseService= $injector.get("ParseService");
    }));

    it("should get pending approvals and my leaderboards called upon initialization", function(){

        spyOn(ParseService, "getMyPendingApprovals").and.callFake(function() {
            var promise = new Parse.Promise();
            promise.resolve([]);
            return promise;
        });
        spyOn(ParseService, "getMyLeaderboards").and.callFake(function() {
            var promise = new Parse.Promise();
            promise.resolve([]);
            return promise;
        });

        // initialize home controller
        controller = $controller("HomeController", {
            $scope: $scope,
            $rootScope: rootScope
        });

        expect(ParseService.getMyPendingApprovals.calls.count()).toEqual(1);
        expect(ParseService.getMyLeaderboards.calls.count()).toEqual(1);
    });

    describe("after initialization", function(){
        beforeEach(function() {
            spyOn(ParseService, "getMyPendingApprovals").and.callFake(function() {
                var promise = new Parse.Promise();
                promise.resolve([]);
                return promise;
            });
            spyOn(ParseService, "getMyLeaderboards").and.callFake(function() {
                var promise = new Parse.Promise();
                promise.resolve([]);
                return promise;
            });

            // initialize home controller
            controller = $controller("HomeController", {
                $scope: $scope
            });
        });

        it("should properly set the rootLoading to automate the popup for leaving a leaderboard if leaving the leaderboard worked", function(){

            spyOn(rootScope, "setRootLoading");

            // removeSelfFromLeaderboard SUCCEEDS
            spyOn(ParseService, "removeSelfFromLeaderboard").and.callFake(function(leaderboard) {
                var promise = new Parse.Promise();
                promise.resolve(true);
                return promise;
            });

            expect(rootScope.rootLoading).toBe(false);

            // perform the action
            controller.leaveLeaderboard(null);

            expect(rootScope.rootLoading).toBe(false);

            // first call to setRootLoading should turn the flag ON
            expect(rootScope.setRootLoading.calls.argsFor(0)[0]).toBe(true);
            // second call to setRootLoading should turn the flag OFF
            expect(rootScope.setRootLoading.calls.argsFor(1)[0]).toBe(false);
        });

        it("should properly set the rootLoading to automate the popup for leaving a leaderboard if leaving the leaderboard failed", function(){

            spyOn(rootScope, "setRootLoading");

            // removeSelfFromLeaderboard FAILS
            spyOn(ParseService, "removeSelfFromLeaderboard").and.callFake(function(leaderboard) {
                var promise = new Parse.Promise();
                promise.resolve(false);
                return promise;
            });

            expect(rootScope.rootLoading).toBe(false);

            // perform the action
            controller.leaveLeaderboard(null);

            expect(rootScope.rootLoading).toBe(false);

            // first call to setRootLoading should turn the flag ON
            expect(rootScope.setRootLoading.calls.argsFor(0)[0]).toBe(true);
            // second call to setRootLoading should turn the flag OFF
            expect(rootScope.setRootLoading.calls.argsFor(1)[0]).toBe(false);
        });

        it("should properly set the rootLoading to automate the popup for responding to an approval if responding to the approval worked", function(){

            spyOn(rootScope, "setRootLoading");

            // removeSelfFromLeaderboard SUCCEEDS
            spyOn(ParseService, "respondToApproval").and.callFake(function(leaderboard) {
                var promise = new Parse.Promise();
                promise.resolve(true);
                return promise;
            });

            expect(rootScope.rootLoading).toBe(false);

            // perform the action
            controller.approvalResponseAction(null);

            expect(rootScope.rootLoading).toBe(false);

            // first call to setRootLoading should turn the flag ON
            expect(rootScope.setRootLoading.calls.argsFor(0)[0]).toBe(true);
            // second call to setRootLoading should turn the flag OFF
            expect(rootScope.setRootLoading.calls.argsFor(1)[0]).toBe(false);
        });

        it("should properly set the rootLoading to automate the popup for responding to an approval if responding to the approval failed", function(){

            spyOn(rootScope, "setRootLoading");

            // removeSelfFromLeaderboard FAILS
            spyOn(ParseService, "respondToApproval").and.callFake(function(leaderboard) {
                var promise = new Parse.Promise();
                promise.resolve(false);
                return promise;
            });

            expect(rootScope.rootLoading).toBe(false);

            // perform the action
            controller.rejectResponseAction(null);

            expect(rootScope.rootLoading).toBe(false);

            // first call to setRootLoading should turn the flag ON
            expect(rootScope.setRootLoading.calls.argsFor(0)[0]).toBe(true);
            // second call to setRootLoading should turn the flag OFF
            expect(rootScope.setRootLoading.calls.argsFor(1)[0]).toBe(false);
        });
    });
});
