var mongo = require('mongodb');
const mongoose = require("mongoose")
const autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost/freecodecamp");

autoIncrement.initialize(connection);
    
var urlSchema = mongoose.Schema({
      id: Number,
      mUrl: String,
      createdAt: Date
    })


urlSchema.plugin(autoIncrement.plugin, 'URL');
var URL = connection.model('Url', urlSchema);

module.exports = {
    
    addURL(req,res){
        var url_input = req.url;
        console.log("url_valid",url_input);
        var practicalNodeUrl = new URL({mUrl: url_input, createdAt: Date.now()})   
        practicalNodeUrl.save((error, results) => {
            if (error){
              console.error(error);
              process.exit(1);
            }
            // Find last _id inserted
            URL.findOne({},'_id',(error, urlDoc) => {
                if (error){
                    console.error(error);
                    process.exit(1);
                }
                res.json({"original_url": url_input,"short_url":urlDoc._id});
            }).sort({_id: -1})
        })
    },
    getUrl(req,res){
        URL.findOne({_id: req.params.urlId},'mUrl',(error, urlDoc) => {
            if (error){
                console.error(error);
                process.exit(1);
            }
            return (res.redirect(urlDoc.mUrl));
        })
    }
}