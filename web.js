"use strict";

var express = require("express"),
        app = express();
        app.set("view enginer", "html");
        app.use(express.static(__dirname));

app.get('/', function(req, res) {
    res.sendfile('index.html');
});
var server = app.listen(process.env.PORT || 3000);
