var MongoClient = require('mongodb').MongoClient,
    settings = require('./config.js'),
    Guid = require("guid");

var fullMongoUrl = settings.mongoConfig.serverUrl + settings.mongoConfig.database;

function runSetup() {
    return MongoClient.connect(fullMongoUrl)
        .then(function(db) {
            return db.collection("users").drop().then(function() {
                return db;
            }, function() {
                // We can recover from this; if it can't drop the collection, it's because
                // the collection does not exist yet!
                return db;
            });
        }).then(function(db) {
            // We've either dropped it or it doesn't exist at all; either way, let's make 
            // a new version of the collection
            return db.createCollection("users");
        });
}

// By exporting a function, we can run 
var exports = module.exports = runSetup;