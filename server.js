// We first require our express package
var express = require('express');
var bodyParser = require('body-parser');
var bcrypt = require("bcrypt-nodejs");
var cookieParser = require('cookie-parser');
var myData = require('./data.js');

// This package exports the function to create an express instance:
var app = express();


var error_message = "";
var activeSessionIDs = [];
// We can setup Jade now!
app.set('view engine', 'ejs');

// This is called 'adding middleware', or things that will help parse your request
app.use(cookieParser());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// This middleware will activate for every request we make to 
// any path starting with /assets;
// it will check the 'static' folder for matching files 
app.use('/assets', express.static('static'));

// Setup your routes here!

app.use('/logout',function(request, response, next){
		var sessionID = request.cookies.sessionID;
		
		myData.clearSessionID(sessionID);
		var anHourAgo = new Date();
        anHourAgo.setHours(anHourAgo.getHours() -1);

        response.cookie("sessionID", "", {expires : anHourAgo});
        response.clearCookie("sessionID");
        next();
});

app.use(function(request, response, next){
	// if(request.path == "/" || request.path == "/profile")
	// {
			if(request.cookies.sessionID)
			{
				myData.verifySessionID(request.cookies.sessionID).then(function(result){

					if(result.length === 1)
					{
						//response.render("pages/profile", {welcomeNote: "Welcome "+result[0].username, profileData: result});
						//response.redirect("/profile");
						next();
					}
					else
					{
						response.redirect("/logout");
					}
				}).catch(function(error){
					var anHourAgo = new Date();
			        anHourAgo.setHours(anHourAgo.getHours() -1);

			        response.cookie("sessionID", "", {expires : anHourAgo});
			        response.clearCookie("sessionID");
			        response.redirect("/");
			        return;

				});
				return;
			}


	//}
	next();
});

function fetchProfile(username){

}


app.post("/logout", function (request, response){
		response.redirect("/");
})

app.post("/validate_user", function (request, response){
	var username = request.body.username;
	var hashedPass = bcrypt.hashSync(request.body.password);

	myData.verifyUsernameOnSignUp(username).then(function(username){
		//adding user after confirming that it doesn't already exists
			myData.addUser(username, hashedPass).then(function(profile){
				response.render("pages/login-register", {welcomeNote : "Successfully Registered!"});
			});
		//finish adding new user to the database.
	}).catch(function(error){
		response.render("pages/login-register", {welcomeNote : error});
	});
});

app.post("/user_login", function (request, response){
	var username = request.body.username;
	var password = request.body.password;
	myData.verifyUserOnLogin(username, password).then(function(result){
		if(result)
		{
			//Creating a new cookie and storing the session ID and username
			var now = new Date();
		    var expiresAt = new Date();
		    expiresAt.setHours(expiresAt.getHours() + 1);

		    response.cookie("sessionID", result, { expires: expiresAt });
		    
			//Rendering the user profile page.
			response.redirect("/profile");
			
			
		}
	}).catch(function(error){
		response.render("pages/login-register", {welcomeNote : error});
	});
});

app.get("/profile", function(request, response){
		if(typeof request.cookies.sessionID === "undefined")
		{
			response.redirect("/");
		}
		else
		{
			myData.fetchProfile(request.cookies.sessionID).then(function(profileData){
				response.render("pages/profile", {welcomeNote: "Welcome ", profileData: profileData});
			});
			
		}
	
	
});

app.post("/update_profile",function (request, response){
	
		var fname = request.body.firstname;
		var lname = request.body.lastname;
		var hobby = request.body.hobby;
		var petname = request.body.petname;
		var sessionID = request.cookies.sessionID;
		myData.updateProfile(sessionID, fname, lname, hobby, petname).then(function(result){
			if(result === true)
			{
				response.redirect("/profile");
			}
		});
	
});



app.get("/", function (request, response) { 
	if(typeof request.cookies.sessionID === "undefined")
	{
    	response.render("pages/login-register");
    }
    else
    {
    	response.redirect("/profile");
    }
});

	
// We can now navigate to localhost:3000
app.listen(3000, function () {
    console.log('Your server is now listening on port 3000! Navigate to http://localhost:3000 to access it');
});
