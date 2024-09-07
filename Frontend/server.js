// Alden Chia Yu Xiang
// 2205584
// DISM/FT/2A/01

const express = require("express");
const serveStatic = require("serve-static");

var hostname = "localhost";
var port = 3001;

var app = express();

app.use(function (req, res, next) {
  console.log(req.url);
  console.log(req.method);
  console.log(req.path);
  console.log(req.query.id);

  if (req.method != "GET") {
    res.type(".html");
    var msg =
      "<html><body>This server only serves web pages with GET!</body></html>";
    res.end(msg);
  } else {
    next();
  }
});

const sendFileOptions = {
  root: __dirname
}

app.get('/game/:gameid/:platformname', (req, res) => {
  console.log(req.params);
  res.status(200).sendFile("./public/indivGame.html", sendFileOptions)
})

app.use(serveStatic(__dirname + "/public"));

app.listen(port, hostname, function () {
  console.log(`Server hosted at http://${hostname}:${port}`);
});

app.use((req, res) => {
  res.status(404).sendFile("./public/error.html", sendFileOptions)
})