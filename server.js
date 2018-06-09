'use strict';

var express = require('express');
var cors = require('cors');
const dns = require('dns');
var myApi = require("./cr-api.js");

var app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  

app.post("/api/shorturl/new", function (req, res) {
  console.log("url",req.body.url);
  // Check if the URL exists
  dns.lookup(req.body.url,(error, addresses, family) => {
    if (error){
      var jsonError = {"error":"invalid URL"};
      res.status(200).json(jsonError);
      console.error(error.message);
    }else{
      myApi.addURL(req.body,res);  
    }
  })
  
});

app.get("/api/shorturl/:urlId", function (req, res) {
  myApi.getUrl(req,res);
});



app.listen(port, function () {
  console.log('Node.js listening ...');
});