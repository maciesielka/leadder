"use strict";

describe("BodyController", function(){
    var $controller, controller, $location;
    beforeEach(module("leadder"));
    beforeEach(inject(function($injector) {
        $controller = $injector.get("$controller");
        var location = $injector.get("$location");
        controller = $controller("BodyController", {
            $location: location
        });
        $location = location;
    }));

    it("should report isActive === true when the path is correct", function(){
        spyOn($location, "path").and.callFake(function(path) {
            return "path";
        });

        expect(controller.isActive("path")).toBe(true);
    });

    it("should report isActive === false when the path is incorrect", function(){
        spyOn($location, "path").and.callFake(function(path) {
            return "path";
        });

        expect(controller.isActive("wrong_path")).toBe(false);
    });
});
