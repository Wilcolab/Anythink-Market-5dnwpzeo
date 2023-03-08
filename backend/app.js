require("dotenv").config();
var http = require("http"),
  path = require("path"),
  methods = require("methods"),
  express = require("express"),
  bodyParser = require("body-parser"),
  session = require("express-session"),
  cors = require("cors"),
  passport = require("passport"),
  errorhandler = require("errorhandler"),
  mongoose = require("mongoose");

var isProduction = process.env.NODE_ENV === "production";

// Create global app object
var app = express();

app.use(cors());

// HTTP request to OPENAI API 
async function generateImage(prompt) {
  return await axios.post('https://api.openai.com/v1/images/generations', JSON.stringify({
      'prompt': `${prompt}`,
      'n': 1,
      'size': '256x256'
  }), {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
  }).then(function (response) {
      return response.data.data[0].url;
  })
      .catch(function (error) {
          console.log(`Image genrator failed with the error: ${error}`)
          return '';
      });
  }

  // 
  var item = new Item(req.body.item);

  item.seller = user;

  if(!item.image) {
    item.image = await generateImage(item.title);
  }

// Normal express config defaults
app.use(require("morgan")("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require("method-override")());
app.use(express.static(__dirname + "/public"));

app.use(
  session({
    secret: "secret",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);

if (!isProduction) {
  app.use(errorhandler());
}

if (!process.env.MONGODB_URI) {
  console.warn("Missing MONGODB_URI in env, please add it to your .env file");
}

mongoose.connect(process.env.MONGODB_URI);
if (isProduction) {
} else {
  mongoose.set("debug", true);
}

require("./models/User");
require("./models/Item");
require("./models/Comment");
require("./config/passport");

app.use(require("./routes"));

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
  if (req.url === "/favicon.ico") {
    res.writeHead(200, { "Content-Type": "image/x-icon" });
    res.end();
  } else {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
  }
});

/// error handler
app.use(function(err, req, res, next) {
  console.log(err.stack);
  if (isProduction) {
    res.sendStatus(err.status || 500)
  } else {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
        error: err
      }
    });
  }
});

// finally, let's start our server...
var server = app.listen(process.env.PORT || 3000, function() {
  console.log("Listening on port " + server.address().port);
});
