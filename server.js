var express = require("express");
var app = express();

app.use("/", function(req, res){
    res.end("Default Route")
});

var server = app.listen(process.env.PORT || 8080, function(){
});