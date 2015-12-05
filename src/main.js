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
                controller: function($location, $rootScope) {
                    Parse.User.logOut().then(function(){
                        $location.path("/login");
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
