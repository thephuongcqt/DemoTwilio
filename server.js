var express = require("express");
var app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.post("/Voice", function (req, response) {
    // res.set('Content-Type', 'text/xml');
    const VoiceResponse = require('twilio').twiml.VoiceResponse;
    // const twiml = new VoiceResponse();
    // var recordURL = req.protocol + '://' + req.get('host') + '/Recorded';    

    // twiml.play("https://firebasestorage.googleapis.com/v0/b/callcenter2-79faf.appspot.com/o/audio%2Fdefault_greeting.mp3?alt=media&token=d91ed4a4-8a8e-4747-a047-d15397a9e15f");
    // twiml.record({
    //     recordingStatusCallback: recordURL,
    //     method: 'POST',
    // });
    // res.end(twiml.toString());

    const twiml = new VoiceResponse();

    // Use the <Gather> verb to collect user input
    const gather = twiml.gather({
        input: 'speech dtmf',
        numDigits: '1',
        timeout: 10,
        action: '/completed'
    });
    gather.say('For sales, press 1. For support, press 2.');

    // If the user doesn't enter input, loop
    //   gather.say('Welcome to Twilio, please tell us why you\'re calling');

    // Render the response as XML in reply to the webhook request
    response.type('text/xml');
    response.send(twiml.toString());
});

app.post("/completed", function (req, res) {
    console.log(req.body);
});

app.post("/Recorded", function (req, res) {
    res.end();
    var recordingUrl = req.body.RecordingUrl;
    var speechToText = require("./SpeechToText");

    speechToText.getTextFromVoice(recordingUrl)
        .then(transcription => {
            console.log(transcription);
        })
        .catch(err => {
            console.log(err);
        })
});

app.use("/", function (req, res) {
    res.end("default route");
});

var server = app.listen(process.env.PORT || 8080, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});