"use strict";

angular
    .module("leadder", ["ngRoute"])
    .config(function($routeProvider) {
        $routeProvider
            .when("/login", {
                templateUrl: "/src/templates/login.html",
                controller: "LoginController",
                controllerAs: "vm"
            })
            .when("/logout", {
                // implicitly describe the controller
                // to redirect immediately
                controller: function($location, $rootScope, $route) {
                    Parse.User.logOut().then(function(){
                        $location.path("/login");
                        $route.reload();
                    });
                },
                template: "" // blank page
            })
            .when("/", {
                templateUrl: "/src/templates/home.html",
                controller: "HomeController",
                controllerAs: "vm"
            })
            .when("/explore", {
                templateUrl: "/src/templates/explore.html",
                controller: "ExploreController",
                controllerAs: "vm"
            })
            .when("/leaderboards/:id", {
                templateUrl: "/src/templates/leaderboard.html",
                controller: "LeaderboardController",
                controllerAs: "vm",
                resolve: {
                    leaderboard: function($route) {
                        var promise = new Parse.Promise();
                        var query = new Parse.Query("Leaderboard");
                        var leaderboard = null;
                        query.get($route.current.params.id).then(function(l) {
                            leaderboard = l;
                            var relation = leaderboard.relation("participants");
                            var query = relation.query();
                            return query
                                .include("user")
                                .find();
                        }).then(function(results) {
                            leaderboard.participants = results;
                            promise.resolve(leaderboard);
                        }, function(error) {
                            promise.resolve(null);
                        });
                        return promise;
                    }
                }
            })
            .when("/add-leaderboard", {
                templateUrl: "/src/templates/add-leaderboard.html",
                controller: "AddLeaderboardController",
                controllerAs: "vm"
            })
            .when("/users/:id", {
                templateUrl: "/src/templates/profile.html",
                controller: "ProfileController",
                controllerAs: "vm",
                resolve: {
                    user: function($route, ParseService) {

                        var query = new Parse.Query(Parse.User);
                        return query
                                .get($route.current.params.id);
                    },

                    profiles: function($route, ParseService) {
                        var query = new Parse.Query(Parse.User);
                        return query.get($route.current.params.id).then(function(user) {
                            return ParseService.getUserPlayerProfiles(user);
                        });
                    },

                    matches: function($route, ParseService) {
                        var promise = new Parse.Promise();

                        var query = new Parse.Query(Parse.User);
                        return query.get($route.current.params.id).then(function(user) {
                            return ParseService.getMatchesForUser(user);
                        });
                    }
                }
            })
            .otherwise("/login");
    })
    .run(function($rootScope, $location) {
        // check to see if we"re logged in for non-public pages
        $rootScope.$on("$routeChangeStart", function(event, next, current) {
            if (!Parse.User.current() && $location.path() !== "/login") {
                $location.path("/login");
            } else if(Parse.User.current() && $location.path() === "/login") {
                $location.path("/");
            }
        });
    });
