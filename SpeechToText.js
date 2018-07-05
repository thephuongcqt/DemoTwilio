const speech = require('@google-cloud/speech');
const https = require('https');

const googleClient = new speech.SpeechClient({
    keyFilename: './certificate.json'
});

var sttFunctions = {
    getTextFromVoice: function (url) {
        return new Promise((resolve, reject) => {
            https.get(url, function (res) {
                var data = []; // List of Buffer objects
                res.on("data", function (chunk) {
                    data.push(chunk); // Append Buffer object
                });
                res.on("end", function () {
                    data = Buffer.concat(data); // Make one large Buffer of it
                    const audioBytes = data.toString("base64");

                    const audio = {
                        content: audioBytes,
                    };
                    const config = {
                        encoding: 'LINEAR16',
                        sampleRateHertz: 8000,
                        languageCode: 'vi-VN',
                    };
                    const request = {
                        audio: audio,
                        config: config,
                    };
                    googleClient
                        .recognize(request)
                        .then(data => {
                            const response = data[0];
                            const transcription = response.results
                                .map(result => result.alternatives[0].transcript)
                                .join('\n');
                            resolve(transcription);
                        })
                        .catch(err => {                            
                            reject(err);
                        });
                });
            });
        });
    }
};
module.exports = sttFunctions;