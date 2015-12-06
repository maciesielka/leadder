"use strict";

describe("LoginController", function(){

    var $controller, controller, ParseService, $scope, rootScope;
    beforeEach(module("leadder"));
    beforeEach(inject(function($injector, $rootScope) {
        $scope = $rootScope.$new();
        $controller = $injector.get("$controller");
        var bodyController = $controller("BodyController");
        rootScope = $rootScope;
        ParseService= $injector.get("ParseService");
        controller = $controller("LoginController", {
            $scope: $scope
        });
    }));

    describe("method fixUsername()", function(){
        it("should remove special characters from username field", function(){
            var testUsername = "error#_()*!";
            controller.signUpUsername = testUsername;

            // fix the username
            controller.fixUsername();

            expect(controller.signUpUsername).toBe("error");
        });

        it("should remove spaces from username field", function(){
            var testUsername = "error filled username";
            controller.signUpUsername = testUsername;

            // fix the username
            controller.fixUsername();

            expect(controller.signUpUsername).toBe("errorfilledusername");
        });

        it("should remove special characters and spaces from username field", function(){
            var testUsername = "error#_()*! filled username";
            controller.signUpUsername = testUsername;

            // fix the username
            controller.fixUsername();

            expect(controller.signUpUsername).toBe("errorfilledusername");
        });
    });
});
