var MongoClient = require('mongodb').MongoClient,
 bcrypt = require("bcrypt-nodejs"),
 settings = require('./config.js'),
 runStartup = require("./startup.js"),
 Guid = require('Guid');

var fullMongoUrl = settings.mongoConfig.serverUrl + settings.mongoConfig.database;
var exports = module.exports = {};

runStartup();
MongoClient.connect(fullMongoUrl)
    .then(function(db) {
        var userCollection = db.collection("users");
        
        //exports
        exports.verifyUsernameOnSignUp = function(username){
        	return userCollection.find({ username: username }).toArray().then(function(list) {
                if (list.length === 1) return Promise.reject("Username "+username+" already exists. Try some other username.");

                return username;
           });

        }

        exports.verifyUserOnLogin = function(username, password){
        		return userCollection.find({username : username}).toArray().then(function(entry){
        			if(entry.length !== 1) return Promise.reject("Username "+username+" doesn't exists in the database.");
        			return entry;
        		}).then(function(entry){
                    var res = bcrypt.compareSync(password, entry[0].encryptedPassword)
                        if (res === true) {
                              return true;
                        } else {
                            return Promise.reject("Password Doesn't Match.");
                        }
                    
        		}).catch(function(error){
                    throw error;
                }).then(function(result){
                    var newSessionID = Guid.create().toString();
                    return userCollection.update({ username: username }, { $set: { "currentSessionId": newSessionID } }).then(function() {
                    return newSessionID;
                        });
                });
        }

        exports.verifySessionID = function (sessionID){
            return userCollection.find({currentSessionId : sessionID}).toArray().then(function(entry){
                    if(entry.length === 1) return entry;

                    return Promise.reject("Your have successfully logged out.");   
                });
        }
        exports.clearSessionID = function(sessionID){
            return userCollection.update({ currentSessionId: sessionID }, { $set: { "currentSessionId": null } }).then(function() {
                    return true;
                });
        }

        exports.fetchProfile = function(sessionID){
            return userCollection.find({currentSessionId : sessionID}).toArray().then(function(entry){
                    return entry;
                });
        }

        exports.updateProfile = function(sessionID, fname, lname, hobby, petname){
             return userCollection.update({ currentSessionId: sessionID }, { $set: { "profile.firstname": fname, "profile.lastname": lname, "profile.hobby": hobby, "profile.petname": petname } }).then(function() {
                    return true;
                });
        }

        
        exports.addUser = function(username, hashedPassword){
        	return userCollection.insertOne({ _id: Guid.create().toString(), username: username, encryptedPassword: hashedPassword, currentSessionId: null, profile: {firstname: "", lastname: "", hobby: "", petname: ""} })
        	.then(function(newDoc){
        		return newDoc.profile;
        	});
        }
        
    });
