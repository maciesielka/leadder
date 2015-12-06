"use strict";

angular
    .module("leadder")
    .directive("leaderboard", function(ParseService, $location, $route) {
        return {
            restrict: "E",
            templateUrl: "/src/templates/directives/leaderboard.html",
            link: function($scope) {
                var currentProfileIndex = -1;
                $scope.loading = true;
                $scope.showExtraRow = false;

                $scope.myLeaderboard = ($scope.leaderboard.get("admin").id === Parse.User.current().id);

                $scope.deleteLeaderboard = function() {
                    ParseService.deleteLeaderboard($scope.leaderboard).then(function() {
                        $route.reload();
                    }, function(error) {
                        console.error(error);
                    });
                };

                var relation = $scope.leaderboard.relation("participants");
                var query = relation.query();
                query
                    .include(["user"])
                    .descending("ranking")
                    .find().then(function(results) {
                        $scope.participants = results;

                        if ($scope.limit === "NO_LIMIT") {
                            $scope.limit = results.length;
                        }
                        var numToDisplay = $scope.limit || 5;

                        var currentUserProfile = null;
                        var length = results.length;
                        for (var i = 0; i < length; ++i) {
                            var playerProfile = results[i];
                            if (Parse.User.current().id === playerProfile.get("user").id) {
                                currentUserProfile = playerProfile;
                                currentProfileIndex = i;
                                break;
                            }
                        }

                        if (results.length > numToDisplay) {
                            $scope.extras = [];

                            // the case where the current user is last
                            // but we need to truncate the list to show
                            // this user and the user before him
                            if (currentProfileIndex >= numToDisplay
                                && currentProfileIndex === length-1) {
                                $scope.participants = results.slice(0, numToDisplay-2);
                                $scope.extras = [
                                    results[currentProfileIndex-1],
                                    results[currentProfileIndex]
                                ];
                                $scope.startingIndex = currentProfileIndex - 1;
                            }

                            // should work in all remaining cases because we
                            // already know the list is too long
                            else if (currentProfileIndex >= numToDisplay - 1) {
                                $scope.participants = results.slice(0, numToDisplay-3);
                                $scope.extras = [
                                    results[currentProfileIndex-1],
                                    results[currentProfileIndex],
                                    results[currentProfileIndex+1]
                                ];
                                $scope.startingIndex = currentProfileIndex-1;
                            }

                            else {
                                $scope.participants = $scope.participants.slice(0, numToDisplay);
                            }
                        }
                        $scope.loading = false;
                        $scope.$apply();
                    }, function(error) {
                        console.error(error);
                    });
            },
            scope: {
                buttonAction: "&",
                buttonTitle: "=",
                leaderboard: "=",
                limit: "="
            }
        };
    });
