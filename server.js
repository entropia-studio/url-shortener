'use strict';

const express = require('express');
const cors = require('cors');
const dns = require('dns');
const myApi = require("./cr-api.js");
const url = require("url");
const bodyParser = require("body-parser");

let app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post("/api/shorturl/new", function (req, res) {
  
  // Check if URL exists
  var mUrl = url.parse(req.body.url);
  dns.lookup(mUrl.host,(error, addresses, family) => {
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