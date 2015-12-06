"use strict";

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

angular
    .module("leadder")
    .filter("round", function() {
        return function(input) {
            input = input || 0;
            return Math.round(input);
        };
    })
    .filter("readableDate", function() {
        return function(input) {
            var date = new Date(input);

            var AMPM = "AM";
            var hours = date.getHours();
            if (hours === 0) {
                hours = 12;
            } else if (hours > 12) {
                hours -= 12;
                AMPM = "PM";
            }

            var minutes = date.getMinutes();
            if (minutes < 10) {
                minutes = "0"+minutes;
            }

            return hours+":"+minutes+" "+AMPM+" on "+months[date.getMonth()]+" "+date.getDate()+", "+date.getFullYear();
        };
    });
