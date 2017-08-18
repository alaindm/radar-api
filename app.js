var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
const cors = require("cors");
const placesRouter = require("./routes/places");

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, "client", "build")));

placesRouter(app);

app.get("/*", function(req, res) {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

module.exports = app;
