var express = require('express');
var app = express();
var port = 8080;

var admin = require("firebase-admin");

var serviceAccount = require("./config/nodem-2edaa-firebase-adminsdk-f9x1k-3ef71d5f9d.json")
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nodem-2edaa.firebaseio.com"
});

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));






