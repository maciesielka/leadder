"use strict";

angular
    .module("leadder")
    .controller("LoginController", function(ParseService, $scope, $location) {

        var vm = this;

        vm.login = function() {
            vm.loginError = null;
            ParseService.login(this.loginUsername, this.loginPassword).then(function(user) {
                $location.path("/");
                $scope.$apply();
            }, function(error) {
                vm.loginError = error.message;
                $scope.$apply();
            });
        };

        vm.signUp = function() {
            vm.signUpError = null;
            ParseService.signUp(this.signUpUsername, this.signUpEmail, this.signUpPassword, {
                fullName: this.signUpFullName
            }).then(function(user) {
                $location.path("/");
                $scope.$apply();
            }, function(error) {
                vm.signUpError = error.message;
                $scope.$apply();
            });
        };

        vm.fixUsername = function() {
            this.signUpUsername = this.signUpUsername ? this.signUpUsername.replace(/ /g, '') : "";
        };
    });
