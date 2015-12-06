angular
    .module("leadder")
    .factory("ParseService", function() {
        var ParseService = {};
        var currentUser = function() {
            return Parse.User.current();
        };

        // authentication
        ParseService.login = function(username, password) {
            return Parse.User.logIn(username, password);
        };

        ParseService.signUp = function(username, email, password, attrs) {
            var user = new Parse.User();
            user.set({
                username: username,
                email: email,
                password: password
            });
            return user.signUp(attrs);
        };

        // getting data
        var Leaderboard = Parse.Object.extend("Leaderboard");
        var PlayerProfile = Parse.Object.extend("PlayerProfile");
        var Approval = Parse.Object.extend("Approval");
        var Match = Parse.Object.extend("Match");

        ParseService.getUserPlayerProfiles = function(user) {
            var query = new Parse.Query(PlayerProfile);
            return query
                    .equalTo("user", user)
                    .include(["leaderboard"])
                    .find();
        };

        ParseService.getMatchesForUser = function(user) {
            var promise = new Parse.Promise();

            var query = new Parse.Query(Parse.User);
            ParseService.getUserPlayerProfiles(user).then(function(profiles) {
                var player1Query = new Parse.Query("Match");
                player1Query
                    .containedIn("player1", profiles);

                var player2Query = new Parse.Query("Match");
                player2Query
                    .containedIn("player2", profiles);

                return Parse.Query.or(player1Query, player2Query)
                        .descending("updatedAt")
                        .include(["player1", "player1.user", "player2", "player2.user", "player1.leaderboard"])
                        .find();
            }).then(function(results) {
                promise.resolve(results);
            }, function(error) {
                promise.reject(error);
            });

            return promise;
        };

        ParseService.getMyPlayerProfiles = function() {
            return ParseService.getUserPlayerProfiles(currentUser());
        };

        ParseService.getMyLeaderboards = function() {
            var promise = new Parse.Promise();

            ParseService.getMyPlayerProfiles().then(function(results){
                var arr = results.map(function(el){
                    return el.get("leaderboard");
                });
                promise.resolve(arr);
            }, function(error) {
                promise.reject(error);
            });

            return promise;
        };

        ParseService.getAllOtherLeaderboards = function() {
            var promise = new Parse.Promise();

            ParseService.getMyPlayerProfiles().then(function(results){
                var query = new Parse.Query(Leaderboard);
                return query
                    .notContainedIn("participants", results)
                    .find();
            }).then(function(results){
                promise.resolve(results);
            }, function(error) {
                promise.reject(error);
            });

            return promise;
        };

        ParseService.getMyPendingApprovals = function() {
            return ParseService.getMyPlayerProfiles().then(function(profiles) {
                var query = new Parse.Query(Approval);
                return query
                        .containedIn("player", profiles)
                        .equalTo("pending", true)
                        .include(["match", "match.leaderboard", "match.player1", "match.player1.user", "match.player1.leaderboard", "match.player2", "match.player2.user", "reporter", "reporter.user"])
                        .find();
            });
        };

        ParseService.addNewLeaderboard = function(name, K) {
            var leaderboard = new Leaderboard();
            leaderboard.set({
                name: name,
                K: K,
                admin: Parse.User.current()
            });

            return leaderboard.save();
        };

        // unsubscribe to leaderboard
        ParseService.removeSelfFromLeaderboard = function(leaderboard) {
            var promise = new Parse.Promise();

            var playerProfileQuery = new Parse.Query(PlayerProfile);
            playerProfileQuery
                .equalTo("user", currentUser())
                .equalTo("leaderboard", leaderboard)
                .find().then(function(results) {
                    var profile = results[0];
                    var relation = leaderboard.relation("participants");
                    relation.remove(profile);
                    leaderboard.save().then(function() {
                        return profile.destroy();
                    }).then(function() {
                        promise.resolve(true);
                    }, function(error) {
                        promise.reject(error);
                    });
                }, function(error) {
                    promise.reject(error);
                });

            return promise;
        };

        ParseService.addSelfToLeaderboard = function(leaderboard) {
            var newProfile = new PlayerProfile();

            newProfile.set({
                user: Parse.User.current(),
                leaderboard: leaderboard,
                ranking: 1400
            });
            return newProfile.save();
        };

        ParseService.deleteLeaderboard = function(leaderboard) {
            return leaderboard.destroy();
        };

        // report a new match
        ParseService.reportNewMatch = function(player1, player2, player1Won, reporter) {
            var match = new Match();

            match.set({
                player1: player1,
                player2: player2,
                player1Won: player1Won,
                reporter: reporter
            });
            return match.save();
        };

        ParseService.respondToApproval = function(approval, response) {
            approval.set({
                pending: false,
                approved: response
            });

            return approval.save();
        };

        return ParseService;
    });
