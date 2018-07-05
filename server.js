var express = require("express");
var app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.post("/Voice", function (req, res) {
    res.set('Content-Type', 'text/xml');
    const VoiceResponse = require('twilio').twiml.VoiceResponse;
    const twiml = new VoiceResponse();
    var recordURL = req.protocol + '://' + req.get('host') + '/Recorded';    

    twiml.play("https://firebasestorage.googleapis.com/v0/b/callcenter2-79faf.appspot.com/o/audio%2Fdefault_greeting.mp3?alt=media&token=d91ed4a4-8a8e-4747-a047-d15397a9e15f");
    twiml.record({
        recordingStatusCallback: recordURL,
        method: 'GET',
    });
    res.end(twiml.toString());
});

app.post("/Recorded", function(req, res){
    res.end();
    console.log(req.body);
});

var server = app.listen(process.env.PORT || 8080, function(){
});